'use strict';

// @todo: use routing params here e.g. /api/wishlist/:wishlistName

module.exports = {
    wishlists: {
        wishlist: '/wishlists/:title'
    },
    user: {
        login: '/login',
        register: '/register',
        password: '/password',
        user: '/:user',
        profile: '/:user/profile'
    }
};
