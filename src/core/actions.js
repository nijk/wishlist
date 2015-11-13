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
    appStart: function () {
        console.info(events.APP_START);
        API.fetchCSRFToken();
        this.dispatch(events.APP_START, {});
    },
    addURL: function (url) {
        const that = this;
        const callback = function ( result ) {
            if ( result ) {
                that.dispatch(events.ADD_URL, { url, result });
            }
        };
        API.fetchProduct(url, callback);
    }
};