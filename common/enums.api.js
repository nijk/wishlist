'use strict';

export default {
    queryLimit: 10,
    resources: ['product', 'wishlists', 'users'],
    routes: {
        LOGIN: '/api/login',
        USERS: '/api/users',
        LOOKUP: '/api/lookup/:url',
        WISHLISTS: '/api/wishlists/:id?',
        WISHLISTS_PRODUCT: '/api/wishlists/:resourceID/:collection/:collectionID?'
    }
};
