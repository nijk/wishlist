/**
 * wishlist - server/api
 *
 * Created by nijk on 10/11/2015.
 */

'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const DB = require('./db');
//const Users = DB.connect( (db) => db.collection('users') );

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

// Passport setup
passport.use(new LocalStrategy(
    function(username, password, done) {
        DB.connect( (err, db) => {

            const Users = db.collection('users');
            Users.findOne({ username: username }, (err, user) => {
                if (err) { return done(err); }
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                if (password !== user.password) { //@todo: don't evaluate passwords against unhashed data
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            });
        });
    }
));

module.exports = passport;