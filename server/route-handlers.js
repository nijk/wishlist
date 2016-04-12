/**
 * wishlist - server/routeHandlers
 *
 * Created by nijk on 29/02/2016.
 */

'use strict';

const _ = require('lodash');

const OGScraper = require('open-graph-scraper');
// const ineed = require('ineed');

const { APIError } = require('./api-error');
const DB = require('./db');
const transform = require('../common/transforms');
const { queryLimit } = require('../common/enums.api.js');


module.exports = {
    fetchProductURL (req, res) {
        const url = decodeURIComponent(req.params.url);
        const resultDefaults = { opengraph: false, scraped: false };

        // Scrape from OpenGraph tags
        OGScraper({ url, timeout: 5000 }, (err, result) => {
            if (err) {
                return new APIError({ status: 500, message: `Could not collect product data from: ${url}. Reason: ${result.err}`, originError: err }, req, res);
            }

            res.json(_.extend(result, resultDefaults, { opengraph: true }));
        });

        // @todo: Scrape for data if OG returns no useful results
    },

    retrieveDocuments (resource, req, res) {
        const user = req.user;
        let { page, limit } = req.query;
        page = parseInt(page || 1);
        limit = parseInt(limit || queryLimit);

        DB.retrieveDocuments({user, resource, page, limit})
            .then((results) => {
                res.json(results);
            })
            .catch((err) => new APIError({ status: 409, message: 'Could not retrieve documents', originError: err}, req, res));
    },

    createDocument (resource, req, res) {
        const { collection, item } = req.body;
        const user = req.user;

        if (item) {
            DB.createDocument({ user, resource, collection, doc: item })
                .then((result) => res.json(result.ops))
                .catch((err) => new APIError({ status: 409, message: 'Could not create document', originError: err }, req, res));

        } else {
            new APIError({ status: 409, message: 'Nothing to do: "item" parameter missing' }, req, res);
        }
    },

    updateDocument (resource, req, res) {
        const { items } = req.body;
        const { resourceID, collection, collectionID } = req.params;
        const user = req.user;

        if (user && resourceID && collection && items) {
            DB.updateDocument({ user, resource, resourceID, collection, collectionID, items })
                .then((result) => res.json({ result, items }))
                .catch((err) => new APIError({ code: 500, message: 'Could not update document', originError: err }, req, res));

        } else {
            new APIError({ status: 409, message: 'Nothing to do: "collection" and/or "item" parameters missing' }, req, res);
        }
    }
};
