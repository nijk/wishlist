/**
 * wishlist - core/events
 *
 * Created by nijk on 05/11/15.
 */

'use strict';

const _ = require('lodash');
const keymirror = require('keymirror');
const defaultEvents = {
    CHANGE: 'change'
};

module.exports = _.extend(defaultEvents, keymirror({
    APP_START: null,
    SET_CSRF_TOKEN: null,

    USER_LOGIN: null,
    USER_LOGIN_SUCCESS: null,
    USER_LOGIN_FAILURE: null,

    ADD_URL: null,
    ADD_URL_SUCCESS: null,
    ADD_URL_FAILURE: null,

    MODIFY_PRODUCTS: null,
    MODIFY_PRODUCTS_SUCCESS: null,
    MODIFY_PRODUCTS_FAILURE: null,

    EDIT_PRODUCT: null,
    EDIT_PRODUCT_CANCEL: null,

    FETCH_PRODUCTS: null,
    FETCH_PRODUCTS_SUCCESS: null,
    FETCH_PRODUCTS_FAILURE: null,

    ADD_WISHLIST: null,
    ADD_WISHLIST_SUCCESS: null,
    ADD_WISHLIST_FAILURE: null,

    FETCH_WISHLISTS: null,
    FETCH_WISHLISTS_SUCCESS: null,
    FETCH_WISHLISTS_FAILURE: null
}));
