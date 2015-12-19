/**
 * wishlist - core/actions
 *
 * Created by nijk on 08/11/15.
 */

'use strict';

// const core = require('./Core');
const API = require('./api');
const events = require('./events');

const errorCallback = (e) => {
    // @todo: throw user message
};

module.exports = {
    appStart () {
        API.fetchCSRFToken()
            .then((token) => {
                //console.info('API.fetchCSRFToken().then()', token);
                this.dispatch(events.SET_CSRF_TOKEN, token);
                //this.dispatch(events.APP_START, {});
            }, errorCallback);
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
        const callback = (item) => {
            if (item) {
                this.dispatch(events.ADD_ITEM, item.body[0]);
            }
        };
        API.addWishlistItem({ user: 'nijk', wishlist: 'myWishlist', item }, callback);
    },
    getWishlistItems () {
        API.fetchWishlistItems(1)
            .then(({ body }) => {
                if (body) {
                    console.info('API.fetchWishlistItems(1).then() items.body', body);
                    this.dispatch(events.FETCH_ITEMS_SUCCESS, body);
                }
            }, errorCallback);
    }
};