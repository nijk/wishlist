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

const errorHandler = require('errorhandler');
const helmet = require('helmet');
const passport = require('passport');
const serveStatic = require('serve-static');

const API = require('./api');
const { APIErrorHandler } = require('./api-error');
const routes = require('../common/enums.routes.js');

const serveStaticOpts = { index: ['index.html'] };

module.exports = (app) => {
    app.set('port', process.env.PORT || 3000);

    app.use(bodyParser.json());

    /* Helmet (security headers) */
    app.use(helmet());
    // app.use(helmet.contentSecurityPolicy());

    /* Express */
    app.use(methodOverride());
    app.use(cookieParser());

    /* Passport */
    app.use(passport.initialize());

    /* Static Assets */
    app.use(serveStatic('dist', serveStaticOpts));

    for(var route in routes) {
        // Support client side routing, by serving index.html on any route the app supports.
        app.get(routes[route], (req, res) => {
            res.sendFile('dist/index.html', { root: '.'});
        });
    }

    /* API */
    app.use((req, res, next) => {
        res.error = null;
        next();
    });
    app.use(API);
    app.use(APIErrorHandler);

    /* Error Handling: middleware should be loaded after the loading the routes */
    if ('development' == app.get('env')) {
        app.use(logger('dev'));
        app.use(errorHandler);
    }
};