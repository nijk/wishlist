/**
 * wishlist - server/api
 *
 * Created by nijk on 10/11/2015.
 */

'use strict';

const _ = require('lodash');
//const csrf = require('csurf')();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const nJwt = require('njwt');
const Cookies = require('cookies');
const crypto = require('crypto');
const UUID = require('node-uuid');

const { APIError } = require('./api-error');
const DB = require('./db');

const hash = (value, salt) => crypto.createHmac('sha256', salt).update(value).digest('hex');

const setUserSalt = (user) => {
    user.salt = user.salt || UUID.v4();
    return user;
};

const setSigningKey = () => {
    //return UUID.v4();
    return '365bdede-549b-46aa-ac84-edc2cf8013d8'; // @todo: move this out to DB/config storage
};

const createCSRFToken = (user) => {
    return hash(user._id + Date.now(), user.salt)
};

const createUser = (username = null) => {
    if (!username) {
        return setUserSalt({});
    }
};

const setUserField = (user, { field, value, secure = false }) => {
    if (secure) {
        user[field] = hash(value, user.salt);
    } else {
        user[field] = value;
    }
    return user;
};

const setFields = (user, fields = []) => _.reduce(fields, setUserField, user);

const signingKey = setSigningKey();

const verifyCSRFToken = (req, res, done) => {
    // Idempotent resources don't need CSRF protection
    if ('GET' === req.method) done();

    const csrfToken = new Cookies(req,res).get(auth._config.csrfName);
    const { body } = req.jwtNewToken;


    if (!csrfToken || body.csrfToken !== csrfToken) {
        done(new Error('CSRF Token missing or invalid'));
    }

    done();
};

const auth = {
    _config: {
        signingKey,
        jwtName: 'access_token',
        csrfName: 'csrf_token'
    },

    loginUser: (req, res, next) => {
        if (!req.user._id) {
            next(new APIError(err, 'User not found', 404));
        }

        const csrfToken = 'csrfToken';
        //const csrfToken = createCSRFToken(req.user);

        const jwt = nJwt.create({
            iss: "http://localhost:3000", // @todo: move this out to config
            sub: req.user._id,
            exp: (Date.now() / 1000) + (24 * 3600),
            scope: "self",
            csrfToken: csrfToken
        }, auth._config.signingKey);

        new Cookies(req,res).set(auth._config.jwtName, jwt.compact(), {
            httpOnly: true,
            secure: false /*true */ // @todo: change for prod
        });

        // This csrf cookie is intentionally set as insecure so that the browser will trigger SOP:
        // see https://stormpath.com/blog/build-secure-user-interfaces-using-jwts/
        new Cookies(req,res).set(auth._config.csrfName, csrfToken, {
            httpOnly: false,
            secure: false
        });

        next();
    },

    verifyUser: (req, res, next) => {
        req.jwtToken = new Cookies(req,res).get(auth._config.jwtName);
        if (!req.jwtToken) return new APIError({ message: 'User not logged in', status: 401 }, req, res);

        nJwt.verify(req.jwtToken, auth._config.signingKey, (err, token) => {
            if (err) {
                err.message = 'Not authenticated';
                err.status = 401;
                return new APIError(err, req, res);
            }

            req.jwtNewToken = token;

            DB.retrieveDocuments({ resource: 'users', find: { _id: token.body.sub } })
                .then((user) => {
                    // Set the userID & CSRF salt
                    const userMatch = user[0];
                    req.user = { _id: userMatch._id.toString(), salt: userMatch.salt.toString() };

                    // @todo: Refresh the token with an updated expiry time
                })
                .then(() => verifyCSRFToken(req, res, (err) => {
                    if (err) return APIError({ code: 401, msg: 'CSRF error', originError: err }, req, res);
                    next();
                }))
                .catch((err) => APIError({ code: 401, msg: 'Cannot find user', originError: err }, req, res));
        });
    },

    createUser: ({ email, password }) => new Promise((resolve, reject) => {
        // @todo: Validate user's email address
        const query = { dbName: 'wishlist', resource: 'users' };
        DB.retrieveDocuments(_.merge(query, { find: { email } }))
            .then((result) => {
                if (_.some(result[0])) {
                    console.info('User exists', result[0]);
                    return reject(new Error(`User with email ${email} already exists`));
                }

                let user = createUser();
                user = setFields(user, [
                    { field: 'email', value: email },
                    { field: 'password', value: password, secure: true }
                ]);
                resolve(DB.createDocument(_.merge(query, { doc: user })));
            });
    }),

    isValidUserFieldValue: (user, { field, value }) => {
        const userField = user[field];
        if (!userField) {
            return false;
        }
        return userField === hash(value, user.salt);
    }
};

// Passport Local setup
passport.serializeUser((user, done) => done(null, user._id));

passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    DB.authenticateUser({ email, password })
        .then((user) => {
            if (!user) {
                return done(null, false, { message: 'Incorrect email address' });
            }
            // Validate password
            if (!auth.isValidUserFieldValue(user, { field: 'password', value: password })) {
                return done(null, false, { message: 'Incorrect password' });
            }
            return done(null, user);
        })
        .catch(done);
}));

module.exports = auth;