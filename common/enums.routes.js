'use strict';

// @todo: use routing params here e.g. /api/wishlist/:wishlistName

module.exports = {
    home: '/',
    wishlists: '/wishlists',
    wishlist: '/wishlists/:title',
    login: '/login',
    register: '/register',
    password: '/password',
    user: '/:user',
    profile: '/:user/profile'
};
