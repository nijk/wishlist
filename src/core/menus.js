/**
 * wishlist - core/menus
 *
 * Created by nijk on 30/12/2015.
 */

'use strict';

const keymirror = require('keymirror');
const routes = require('../../common/enums.routes');
const keys = keymirror({
    'main': null,
    'utility': null
});

module.exports = {
    '_keys': keys,
    [keys.main]: [
        {
            name: 'Home',
            link: {
                title: 'Home page',
                url: routes.home
            }
        },
        {
            name: 'Wishlists',
            link: {
                title: 'Your wishlists',
                url: routes.wishlists
            }
        }
    ],
    [keys.utility]: [
        {
            name: 'User',
            link: {
                title: 'You',
                url: routes.user
            }
        },
        {
            name: 'Profile',
            link: {
                title: 'Your profile',
                url: routes.profile
            }
        }
    ]
};
