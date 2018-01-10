/**
 * wishlist - server/api
 *
 * Created by nijk on 10/11/2015.
 */
const Router = require('express').Router();
const passport = require('passport');

const auth = require('./auth');
const handlers = require('./route-handlers');
const { RouterErrorRouteHandler } = require('./api-error');

import { ROUTES } from '../common/enums.api';

/**
 * Router: POST Login
 * User login
 *
 * @todo: test coverage
 */
Router.post(ROUTES.LOGIN,
    passport.authenticate('local'),
    auth.loginUser,
    (req, res) => {
        const { _id, name, email } = req.user;
        res.json({ user: { _id, name, email } });
    }
);

/**
 * Router: POST User
 * Create new user accounts
 *
 * @todo: test coverage
 */
/*Router.post(ROUTES.USERS, (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        auth.createUser({ email, password })
            .then((result) => res.json(result.ops))
            .catch((err) => RouterError({ code: 409, msg: 'Could not create user', originError: err }, req, res));
    } else {
        RouterError({ code: 409, msg: 'Nothing to do: "email" and/or "password" parameters missing.' }, req, res);
    }
});*/

/**
 * Router: GET Wishlists
 * With paging
 *
 * @todo: test coverage
 */
Router.get(ROUTES.WISHLISTS,
    auth.verifyUser,
    (req, res) => handlers.retrieveDocuments('wishlists', req, res)
);

/**
 * Router: POST Wishlists
 * Create Document
 *
 * @todo: test coverage
 */
Router.post(ROUTES.WISHLISTS,
    auth.verifyUser,
    (req, res) => handlers.createDocument('wishlists', req, res)
);

/**
 * Router: POST Wishlists Products (Create a Product in a given Wishlist)
 * Update Document
 *
 * @todo: test coverage
 */
Router.post(ROUTES.WISHLISTS_PRODUCT,
    auth.verifyUser,
    (req, res) => handlers.createProduct('wishlists', req, res)
);

/**
 * Router: PUT Wishlists Products (Update a Product in a given Wishlist)
 * Update Document
 *
 * @todo: test coverage
 */
Router.put(ROUTES.WISHLISTS_PRODUCT,
    auth.verifyUser,
    (req, res) => handlers.updateProduct('wishlists', req, res)
);

/**
 * Router: GET Any URL
 * Fetch URL data: OG Tags/Scraped Data
 *
 * @todo: test coverage
 */
Router.get(ROUTES.LOOKUP,
    auth.verifyUser,
    handlers.fetchProductURL
);

/**
 * Router: PUT Products
 * Update Products
 *
 * @todo: test coverage
 */
//Router.put(ROUTES.LOOKUP, (req, res) => handlers.updateDocument('products', req, res));

module.exports = Router;
