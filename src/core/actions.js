/**
 * wishlist - core/actions
 *
 * Created by nijk on 08/11/15.
 */

'use strict';

const API = require('./api');
const events = require('./events');
const Promise = require('native-promise-only');

module.exports = {
    appStart () {
        API.fetchCSRFToken();
        this.dispatch(events.APP_START, {});
    },
    addURL (url) {
        const callback = (product) => {
            if ( product ) {
                this.dispatch(events.ADD_URL, { url, product: JSON.parse(product.text) });
            }
        };
        API.fetchProduct(url, callback);
    },
    addWishlistItem (item) {
        this.dispatch(events.ADD_ITEM, item);
    }
};