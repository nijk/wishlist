/**
 * wishlist - server/api
 *
 * Created by nijk on 10/11/2015.
 */

'use strict';

const _ = require('lodash');
const API = require('express').Router();
const csrf = require('csurf')();
const ogScraper = require('open-graph-scraper');
const passport = require('passport');
// const ineed = require('ineed');

const { apiError } = require('./api-error');
const DB = require('./db');
const auth = require('./auth');
const transform = require('../common/transforms');
const { resources, routes, queryLimit } = require('../common/enums.api.js');

/**
 * ValidateResource middleware
 * Checks that the requested resource is valid
 */
function validateResource (req, res, next) {
    // @todo: SECURITY handle/cleanse request data
    const { resource } = req.params;

    if (resource && !_.includes(resources, resource)) {
        apiError({}, 400, 'Invalid resource', res);
    }
    next();
}

/**
 * API: POST Auth/Login
 * User login
 */
API.post(routes.auth.login,
    passport.authenticate('local'),
    auth.loginUser,
    (req, res) => {
        // Authentication successful.
        res.json({ success: true });
});

/**
 *  API: POST User
 *  Create new user accounts
 */
API.post(routes.user,
    (req, res) => {
        const { email, password } = req.body;
        if (email && password) {
            auth.createUser({ email, password })
                .then((result) => res.json(result.ops))
                .catch((err) => {
                    console.info('createUser error', err);
                    apiError(err, 409, 'Could not create user', res);
                });
        } else {
            apiError({}, 400, 'Nothing to do: "email" and/or "password" parameters missing.', res);
        }
    }
);

/**
 *  API: GET CSRF Token
 */
API.get(routes.auth.token,
    csrf,
    (req, res) => res.json({ token: req.csrfToken() })
);

/**
 * API: GET Product URL
 * Fetch URL data: OG Tags/Scraped Data
 */
API.get(routes.product,
    auth.verifyUser,
    (req, res) => {
        const url = decodeURIComponent(req.params.url);
        const resultDefaults = { opengraph: false, scraped: false };

        // Scrape from OpenGraph tags
        ogScraper({ url, timeout: 5000 }, (err, result) => {
            if (err) return apiError(err, 500, `Could not collect product resources from: ${url}. Reason: ${result.err}`, res);
            res.json(_.extend(result, resultDefaults, { opengraph: true }));
        });

        // @todo: Scrape for data if OG returns no useful results
    }
);

/**
 * API: POST Resource/Collection
 * Create Collection/Document
 *
 * @greedy
 */
API.post(routes.collection,
    csrf,
    validateResource,
    auth.verifyUser,
    (req, res) => {
        const { resource, collection } = req.params;
        const { item } = req.body;

        if (collection && item) {
            DB.createDocument({ user: req.userID, resource, collection, doc: item })
                .then((result) => res.json(result.ops))
                .catch((err) => apiError(err, 500, 'Could not create document', res));

        } else if (item) {
            DB.createCollection({ user: req.userID, resource, collection: item.name })
                .then((name) => {
                    const location = transform.route(routes.collection, { resource: resource, collection: name });
                    res.status(201);
                    res.set('Location', location);
                    res.send();
                })
                .catch((err) => apiError(err, 500, 'Could not create collection', res));
        } else {
            apiError({}, 500, 'Nothing to do: "item" parameter missing.', res);
        }
    }
);

/**
 * API: PUT Document
 * Update Document
 *
 * @greedy
 */
API.put(routes.collection,
    validateResource,
    auth.verifyUser,
    csrf,
    (req, res) => {
        const { resource, collection } = req.params;
        const { item } = req.body;

        if (collection && item) {
            DB.updateDocument({ user: req.userID, resource, collection, doc: item })
                .then((result) => res.json({ result, item }))
                .catch((err) => apiError(err, 500, 'Could not update document', res));

        } else {
            apiError({}, 409, 'Nothing to do: "collection" and/or "item" parameters missing.', res);
        }
    }
);

/**
 * API: DELETE Document
 * Remove Document
 *
 * @greedy
 */
API.delete(routes.collection,
    validateResource,
    auth.verifyUser,
    (req, res) => {
        const { resource, collection, id } = req.params;

        if (collection && id) {
            DB.removeDocument({ user: req.userID, resource, collection, id })
                .then((result) => res.json({ result }))
                .catch((err) => apiError(err, 500, 'Could not remove document', res));

        } else {
            apiError({}, 409, 'Nothing to do: "collection" and/or "id" parameters missing.', res);
        }
    }
);

/**
 * API: GET Resource/Collection
 * With paging
 *
 * @greedy
 */
API.get(routes.collection,
    validateResource,
    auth.verifyUser,
    (req, res) => {
        const { resource, collection } = req.params;
        const userID = req.user.id;

        console.info('Wishlists for User', userID);

        if (!userID) apiError({}, 404, 'User ID missing', res);

        //const dbName = userID + '-wishlist';

        let { page, limit } = req.query;
        page = parseInt(page || 1);
        limit = parseInt(limit || queryLimit);

        if (collection) {
            DB.retrieveDocuments({ user: req.user.id, resource, collection, page, limit })
                .then(res.json)
                .catch((err) => apiError(err, 500, 'Could not retrieve documents', res));
        } else {
            DB.retrieveCollections({ dbName: 'nijk-wishlists', resource, page, limit })
                .then(res.json)
                .catch((err) => apiError(err, 500, 'Could not retrieve collections', res));

        }
    }
);

module.exports = API;