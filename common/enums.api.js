'use strict';

// @todo: use routing params here e.g. /api/wishlist/:wishlistName

module.exports = {
    queryLimit: 10,
    resources: ['wishlists'],
    routes: {
        auth: {
            token: '/api/token',
            login: '/api/login'
        },
        user: '/api/user',
        product: '/api/product/:url',
        collection: '/api/:resource/:collection?/:id?'
    }
};
