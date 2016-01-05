'use strict';

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
