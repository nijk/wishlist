/**
 * wishlist - server/api
 *
 * Created by nijk on 10/11/2015.
 */

'use strict';

const API = require('express').Router();
const passport = require('passport');

const auth = require('./auth');
const handlers = require('./route-handlers');
const { routes } = require('../common/enums.api.js');
const { LOGIN, USERS, PRODUCTS, WISHLISTS } = routes;

/**
 * API: POST Login
 * User login
 *
 * @todo: test coverage
 */
API.post(LOGIN,
    passport.authenticate('local'),
    auth.loginUser,
    (req, res) => res.json({ loggedin: true })
);

/**
 * API: POST User
 * Create new user accounts
 *
 * @todo: test coverage
 */
/*API.post(USERS, (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        auth.createUser({ email, password })
            .then((result) => res.json(result.ops))
            .catch((err) => APIError({ code: 409, msg: 'Could not create user', originError: err }, req, res));
    } else {
        APIError({ code: 409, msg: 'Nothing to do: "email" and/or "password" parameters missing.' }, req, res);
    }
});*/

/**
 * API: GET Wishlists
 * With paging
 *
 * @todo: test coverage
 */
API.get(WISHLISTS, auth.verifyUser, (req, res) => handlers.retrieveDocuments('wishlists', req, res));

/**
 * API: POST Wishlists
 * Create Document
 *
 * @todo: test coverage
 */
API.post(WISHLISTS, auth.verifyUser, (req, res) => handlers.createDocument('wishlists', req, res));

/**
 * API: GET Product URL
 * Fetch URL data: OG Tags/Scraped Data
 *
 * @todo: test coverage
 */
API.get(PRODUCTS, auth.verifyUser, handlers.fetchProductData);

/**
 * API: PUT Products
 * Update Products
 *
 * @todo: test coverage
 */
API.put(PRODUCTS, (req, res) => handlers.updateDocument('products', req, res));

module.exports = API;