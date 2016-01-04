/**
 * wishlist - server/config
 *
 * Created by nijk on 10/11/2015.
 */

'use strict';

// Dependencies
const logger = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');

const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);

const errorHandler = require('errorhandler');
const helmet = require('helmet');
const passport = require('passport');
const serveStatic = require('serve-static');
const expressPromise = require('express-promise');



const DB = require('./db');
const routes = require('../common/enums.routes.js');

const serveStaticOpts = {
    'index': ['index.html']
};

module.exports = (app) => {
    app.set('port', process.env.PORT || 3000);

    app.use(bodyParser.json());

    /* Helmet (security headers) */
    app.use(helmet());
    // app.use(helmet.contentSecurityPolicy());

    /* Express */
    app.use(methodOverride());
    app.use(cookieParser());

    app.use(expressSession({
        secret: "notagoodsecret",
        resave: false,
        saveUninitialized: true,
        store: new MongoStore({
            url: DB._config.url + DB._config.defaultDB
        })
    }));

    app.use(expressPromise());

    /* Passport */
    app.use(passport.initialize());
    app.use(passport.session());

    /* Static Assets */
    app.use(serveStatic('dist', serveStaticOpts));

    for(var route in routes) {
        // Support client side routing, by serving index.html on any route the app supports.
        app.get(routes[route], (req, res) => {
            res.sendFile('dist/index.html', { root: '.'});
        });
    }

    /* Error Handling: middleware should be loaded after the loading the routes */
    if ('development' == app.get('env')) {
        app.use(logger('dev'));
        app.use(errorHandler());
    }
};