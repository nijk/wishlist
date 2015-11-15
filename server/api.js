/**
 * wishlist - server/api
 *
 * Created by nijk on 10/11/2015.
 */

'use strict';

const DB = require('./db');
const csrf = require('csurf')();
const ogScraper = require('open-graph-scraper');
const ineed = require('ineed');
const auth = require('./auth');
const routes = require('../routes.api.js');

// @todo: log errors server-side
function errorHandler (err, msg) {
    return { msg, err };
}

function getUserObject (req, res, id) {
    (id) ? res.json({ username: id }) : res.json(errorHandler(req, 'User not found'));
};

module.exports = (app) => {
    /* API: GET CSRF Token */
    app.get(routes.token, csrf, (req, res) => res.json({ token: req.csrfToken() }) );

    /* API: POST Product URL (Add URL) */
    app.post(routes.productURL, (req, res) => { // @todo: validate CSRF?
        // Scrape from OpenGraph tags
        ogScraper({ url: req.body.url, timeout: 1000 }, (err, result) => {
            result.opengraph = false;
            result.scraped = false;

            if (!err) {
                result.opengraph = true;
                res.json( result );
            } else {
                res.json(errorHandler(err, 'API Error: error collecting resources'));
            }
        });

        // Scrape for data
        /*ineed.collect.images.from(req.body.url, function (err, response, result) {
            if ( !err ) {
                console.log(result);
                res.json( result );
            } else {
                errorHandler(req, res, 'error collecting resources');
            }
        });*/
    });

    /* API: POST Product URL (Add URL) */
    app.post(routes.addWishlistItem, (req, res) => {
        // @todo: validate CSRF?
        // @todo: handle/cleanse request data
        DB.insertDocument(res, req.body.wishlist, req.body.item);
    });

    /*app.get('/api/user/:id?', auth.authenticate('local'), function(req, res) {
        res.json(getUserObject(req, res, req.params.id));
    });

    app.post('/api/login', auth.authenticate('local'), function(req, res) {
        // If this function gets called, authentication was successful.
        res.json(getUserObject(req, res, req.user.username));
    });*/
};