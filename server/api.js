/**
 * wishlist - server/api
 *
 * Created by nijk on 10/11/2015.
 */

'use strict';

const auth = require('./auth');
const csrf = require('csurf')();
const routes = require('../routes.api.js');
const ineed = require('ineed');

function errorHandler (req, res, msg) {

    // @todo: log errors server-side

    res.json({ error: msg });
}

function getUserObject (req, res, id) {
    if (id) {
        res.json({ username: id });
    } else {
        errorHandler (req, res, 'User not found');
    }
};

module.exports = (app) => {
    app.get(routes.token, csrf, function(req, res) {
        res.json({ token: req.csrfToken() });
    });

    app.post(routes.productURL, function(req, res) { // @todo: validate CSRF?

        console.info('productURL', req.body);

        ineed.collect.images.from(req.body.url, function (err, response, result) {
            if ( !err ) {
                // clearTimeout( timeOut );
                console.log(result);
                res.json( result );
            } else {
                errorHandler(req, res, 'error collecting resources');
            }
        });
    });

    /*app.get('/api/user/:id?', auth.authenticate('local'), function(req, res) {
        res.json(getUserObject(req, res, req.params.id));
    });

    app.post('/api/login', auth.authenticate('local'), function(req, res) {
        // If this function gets called, authentication was successful.
        res.json(getUserObject(req, res, req.user.username));
    });*/
};