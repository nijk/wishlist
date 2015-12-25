/**
 * wishlist - core/actions
 *
 * Created by nijk on 08/11/15.
 */

'use strict';

// const core = require('./Core');
const API = require('./api');
const events = require('./events');
const eventsEnums = require('../../enums.events');

const errorCallback = (e, msg = 'Message missing') => {
    // @todo: throw user message
    e.msg = msg;
    console.warn('Core actions: Promise error:', e.msg, e);
};

const eventFactory = function (event, status, payload) {
    const eventName = `${event}_${status}`;
    if (status && (!_.has(eventsEnums, status) || !_.has(events, eventName))) {
        return console.warn('Core actions: Events Factory error: Invalid event or status.', 'Event:', event, 'Status', status);
    }

    console.info('Dispatch:', eventName);

    this.dispatch(eventName, payload || {});
};

const actions = {
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
        const event = events.ADD_ITEM;
        this.dispatch(event, item);

        API.addWishlistItem(item)
            .then(({ body }) => {
                eventFactory.bind(this, event, eventsEnums.SUCCESS, body[0])();
                actions.getWishlistItems.bind(this)();
            },
            (e) => {
                eventFactory.bind(this, event, eventsEnums.FAILURE, {})();
                errorCallback(e, 'addWishlistItem failure');
            });
    },
    getWishlistItems () {
        const event = events.FETCH_ITEMS;
        this.dispatch(event);

        API.fetchWishlistItems(1)
            .then(({ body }) => {
                console.info('API.fetchWishlistItems(1).then() items.body', body);
                eventFactory.bind(this, event, eventsEnums.SUCCESS, body)();
            }, errorCallback);
    },
    getWishlists () {
        const event = events.FETCH_WISHLISTS;
        this.dispatch(event);

        API.fetchWishlists(1)
            .then(({ body }) => {
                console.info('API.fetchWishlists(1).then() wishlists.body', body);
                eventFactory.bind(this, event, eventsEnums.SUCCESS, body)();
            }, errorCallback);
    }
};

module.exports = actions;