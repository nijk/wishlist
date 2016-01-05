/**
 * wishlist - server/api
 *
 * Created by nijk on 10/11/2015.
 */

'use strict';

const _ = require('lodash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const nJwt = require('njwt');
const Cookies = require('cookies');
const crypto = require('crypto');
const UUID = require('node-uuid');

const { apiError } = require('./api-error');
const DB = require('./db');

const hash = (value, salt) => crypto.createHmac('sha256', salt).update(value).digest('hex');

const setUserSalt = (user) => {
    user.salt = user.salt || UUID.v4();
    return user;
};

const setSigningKey = () => {
    return UUID.v4();
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

const auth = {
    _config: { signingKey, jwtName: 'access_token' },

    loginUser: (req, res, next) => {
        if (!req.user._id) {
            throw new Error('User not found');
        }

        const jwt = nJwt.create({
            iss: "http://localhost:3000", // @todo: move this out to config
            sub: req.user._id,
            scope: "self"
        }, signingKey);

        new Cookies(req,res).set(auth._config.jwtName, jwt.compact(), {
            httpOnly: true,
            secure: false /*true */ // @todo: change for prod
        });

        next();
    },

    verifyUser: (req, res, next) => {
        const token = new Cookies(req,res).get(auth._config.jwtName);

        nJwt.verify(token, signingKey, (err, token) => {
            if (err) return apiError(err, 401, 'Not authenticated', res);

            const query = { dbName: 'wishlist', collection: 'users' };
            DB.retrieveDocuments(_.merge(query, { find: { _id: token.body.sub } }))
                .then((user) => {
                    // Set the userID
                    req.userID = user[0]._id;
                    next();
                })
                .catch((e) => apiError(err, 401, 'Not authenticated', res));
        });

    },

    createUser: ({ email, password }) => new Promise((resolve, reject) => {
        // @todo: Validate user's email address
        const query = { dbName: 'wishlist', collection: 'users' };
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
/*passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser((id, done) => {
    const query = { dbName: 'wishlist', collection: 'users' };
    DB.retrieveDocuments(_.merge(query, { find: { _id: id } }))
        .then((user) => done(null, user || false))
        .catch((e) => done(e, false));
});*/

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