/**
 * wishlist - server/api
 *
 * Created by nijk on 10/11/2015.
 */

'use strict';

const _ = require('lodash');
const DB = require('./db');
const csrf = require('csurf')();
const ogScraper = require('open-graph-scraper');
const ineed = require('ineed');
const auth = require('./auth');
const routes = require('../routes.api.js');

// @todo: log errors server-side
function errorHandler (err, errCode, msg, res) {
    const errName = 'API Error';
    const errResponse = { msg: `${errName}: ${err.msg}`, status: errCode, err };
    console.warn(errName, errResponse);
    res.status(errCode);
    res.json(errResponse);
}

function getUserObject (req, res, id) {
    (id) ? res.json({ username: id }) : errorHandler(req, 500, 'User not found', res);
}

module.exports = (app) => {
    /* API: GET CSRF Token */
    app.get(routes.token, csrf, (req, res) => res.json({ token: req.csrfToken() }) );

    /* API: GET Product URL (Fetch URL data: OG Tags/Scraped Data) */
    app.get(routes.productURL, (req, res) => { // @todo: validate CSRF?
        const url = decodeURIComponent(req.params.url);
        const resultDefaults = { opengraph: false, scraped: false };

        // Scrape from OpenGraph tags
        ogScraper({ url, timeout: 5000 }, (err, result) => {
            if (err) errorHandler(err, 500, `Could not collect product resources from: ${url}`, res);
            res.json(_.extend(result, resultDefaults, { opengraph: true }));
        });

        // @todo: Scrape for data if OG returns no useful results
    });

    /* API: POST Wishlist Collection (Save Wishlist item) */
    app.post(routes.collection, (req, res) => {
        // @todo: validate user/wishlist
        // @todo: validate CSRF?
        // @todo: handle/cleanse request data

        const { user, wishlist, item } = req.body;

        DB.createDocument({ user, collection: wishlist, doc: item })
            .then((result) => {
                res.json(result.ops)
            })
            .catch((err) => {
                errorHandler(err, 500, 'Could not create document', res);
            });
    });

    /* API: GET Wishlist Collection By Page (Fetch Wishlist items by page) */
    app.get(routes.collection, (req, res) => {
        let pageNum = 1;

        console.info('collection', req.params);

        if ('page' === req.params.type && req.params.id) {
            pageNum = req.params.id;
        }

        // @todo: validate CSRF?
        // @todo: handle/cleanse request data
        DB.retrieveDocuments(req.params.collection, pageNum)
            .then((result) => {
                res.json(result);
            })
            .catch((err) => {
                errorHandler(err, 500, 'Could not retrieve documents', res);
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