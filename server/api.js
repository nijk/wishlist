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
// const ineed = require('ineed');
// const auth = require('./auth');
const enums = require('../enums.api.js');

// @todo: log errors server-side
function errorHandler (err, errCode, msg, res) {
    const errName = 'API Error';
    const errResponse = { msg: `${errName}: ${msg}`, status: errCode, err };
    // console.warn(errName, errResponse);
    res.status(errCode);
    res.json(errResponse);
}

/**
 * Validate requests
 * @param req
 * @param res
 * @param next
 */
function validator (req, res, next) {
    // @todo: SECURITY validate access
    // @todo: SECURITY handle/cleanse request data
    const { resource } = req.params;

    if (resource && !_.includes(enums.resources, resource)) {
        return errorHandler({}, 400, 'Invalid resource', res);
    }

    next();
}

/**
 * Get User
 * @param req
 * @param res
 * @param id
 */
function getUserObject (req, res, id) {
    (id) ? res.json({ username: id }) : errorHandler(req, 500, 'User not found', res);
}

module.exports = (app) => {
    /**
     *  API: GET CSRF Token
     */
    app.get(enums.routes.auth.token, csrf, validator, (req, res) => res.json({ token: req.csrfToken() }) );

    /**
     * API: GET Product URL
     * Fetch URL data: OG Tags/Scraped Data
     */
    app.get(enums.routes.product, validator, (req, res) => {
        const url = decodeURIComponent(req.params.url);
        const resultDefaults = { opengraph: false, scraped: false };

        // Scrape from OpenGraph tags
        ogScraper({ url, timeout: 5000 }, (err, result) => {
            if (err) return errorHandler(err, 500, `Could not collect product resources from: ${url}. Reason: ${result.err}`, res);
            res.json(_.extend(result, resultDefaults, { opengraph: true }));
        });

        // @todo: Scrape for data if OG returns no useful results
    });


    /**
     * API: POST Resource/Collection
     * Create Collection/Document
     */
    app.post(enums.routes.collection, csrf, validator, (req, res) => {
        const user = 'nijk'; // @todo: User Authentication

        const { resource, collection } = req.params;
        const { item } = req.body;

        if (collection && item) {
            DB.createDocument({ user, resource, collection, doc: item })
                .then((result) => res.json(result.ops))
                .catch((err) => errorHandler(err, 500, 'Could not create document', res));

        } else if (item) {
            DB.createCollection({ user, resource, collection: item.name })
                .then((name) => {
                    // @todo: Isomorphic route transformer
                    const location = enums.routes.collection
                        .replace(':resource', resource)
                        .replace(':collection?', name)
                        .replace(':type?', '')
                        .replace(':id?', '');

                    res.status(201);
                    res.set('Location', location);
                    res.send();
                })
                .catch((err) => errorHandler(err, 500, 'Could not create collection', res));
        } else {
            errorHandler({}, 500, 'Nothing to do: "item" parameter missing.', res);
        }
    });

    /**
     * API: GET Resource/Collection
     * With paging
     */
    app.get(enums.routes.collection, validator, (req, res) => {
        const user = 'nijk'; // @todo: User Authentication

        const { resource, collection, type, id } = req.params;

        let pageNum = 1;
        if ('page' === type && id) { pageNum = id }

        if (collection) {
            DB.retrieveDocuments({ user, resource, collection, pageNum })
                .then(res.json)
                .catch((err) => errorHandler(err, 500, 'Could not retrieve documents', res));
        } else {
            DB.retrieveCollections({ user, resource, pageNum })
                .then(res.json)
                .catch((err) => errorHandler(err, 500, 'Could not retrieve collections', res));

        }
    });

    /*app.get('/api/user/:id?', auth.authenticate('local'), function(req, res) {
        res.json(getUserObject(req, res, req.params.id));
    });

    app.post('/api/login', auth.authenticate('local'), function(req, res) {
        // If this function gets called, authentication was successful.
        res.json(getUserObject(req, res, req.user.username));
    });*/
};