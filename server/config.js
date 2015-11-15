/**
 * wishlist - server/config
 *
 * Created by nijk on 10/11/2015.
 */

'use strict';

const logger = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const errorHandler = require('errorhandler');
const helmet = require('helmet');
const passport = require('passport');
const serveStatic = require('serve-static');
const expressPromise = require('express-promise');

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
    app.use(session({
        secret: "notagoodsecret",
        cookie: { httpOnly: true }
    }));
    app.use(expressPromise());

    /* Passport */
    app.use(passport.initialize());
    app.use(passport.session());

    /* Static Assets */
    app.use(serveStatic('dist', serveStaticOpts));

    /* Error Handling: middleware should be loaded after the loading the routes */
    if ('development' == app.get('env')) {
        app.use(logger('dev'));
        app.use(errorHandler());
    }
};