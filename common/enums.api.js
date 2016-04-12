'use strict';

module.exports = {
    queryLimit: 10,
    resources: ['product', 'wishlists', 'users'],
    routes: {
        LOGIN: '/api/login',
        USERS: '/api/users',
        PRODUCTS: '/api/products/:url',
        WISHLISTS: '/api/wishlists/:id?',
        WISHLISTS_PRODUCTS: '/api/wishlists/:resourceID/:collection/:collectionID?'
    }
};
