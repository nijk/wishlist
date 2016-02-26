'use strict';

// @todo: use routing params here e.g. /api/1.x/wishlists/:wishlistID

module.exports = {
    home: '/',
    wishlists: '/wishlists',
    wishlist: '/wishlists/:id',
    login: '/login',
    register: '/register',
    password: '/password',
    user: '/user/:user',
    profile: '/user/:user/profile'
};
