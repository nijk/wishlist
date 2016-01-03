/**
 * wishlist - core/actions
 *
 * Created by nijk on 08/11/15.
 */

'use strict';

// const core = require('./Core');
const _ = require('lodash');
const API = require('./api');
const events = require('./events');
const eventTypes = require('../../common/enums.events');
const { queryLimit } = require('../../common/enums.api');

const errorCallback = (e, msg = 'Message missing') => {
    // @todo: throw user message
    e.msg = msg;
    console.warn('Core actions: Promise error:', e.msg, e);
};

const eventFactory = function (event, status, payload) {
    const eventName = `${event}_${status}`;
    if (status && (!_.has(eventTypes, status) || !_.has(events, eventName))) {
        return console.warn('Core actions: Events Factory error: Invalid event or status.', 'Event:', event, 'Status', status);
    }

    console.info('Dispatch:', eventName);

    this.dispatch(eventName, payload || {});
};

const cleanseOutgoingParams = (params) => {
    if (params.id) {
        params._id = params.id;
    }

    return _.omit(params, ['id', 'actions', 'onClick']);
};

const cleanseIncomingParams = (params) => {
    if (params._id) {
        params.id = params._id;
    }

    return _.omit(params, '_id');
};

const actions = {
    appStart () {
        API.fetchCSRFToken()
            .then((token) => {
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
    addProduct (product, wishlist) {
        const event = events.MODIFY_PRODUCT;
        const payload = { type: 'update', product };
        this.dispatch(event, payload);

        API.addProduct(product, wishlist)
            .then(({ body }) => {
                payload.product = body[0];
                eventFactory.bind(this)(event, eventTypes.SUCCESS, payload);
            },
            (e) => {
                eventFactory.bind(this)(event, eventTypes.FAILURE, payload);
                errorCallback(e, 'addProduct failure');
            });
    },
    getProducts (wishlist, { limit }) {
        const event = events.FETCH_PRODUCTS;
        this.dispatch(event);

        // Request a multiplied limit and page:1 for infinite scrolling/lazy loaded products
        API.fetchCollection({ resource: 'wishlists', collection: wishlist, page: 1, limit })
            .then(({ body }) => {
                const payload = _.map(body, cleanseIncomingParams);
                eventFactory.bind(this)(event, eventTypes.SUCCESS, payload);
            }, errorCallback);
    },

    editProduct (product) {
        this.dispatch(events.EDIT_PRODUCT, product);
    },

    editProductCancel (product) {
        this.dispatch(events.EDIT_PRODUCT_CANCEL, product);
    },

    updateProduct (product, wishlist) {
        const event = events.MODIFY_PRODUCT;
        const payload = { type: 'update', product };
        this.dispatch(event, payload);

        const data = cleanseOutgoingParams(product);
        API.updateProduct(data, wishlist)
            .then(({ body }) => {
                payload.product = cleanseIncomingParams(body.item);
                eventFactory.bind(this)(event, eventTypes.SUCCESS, payload);
            },
            (e) => {
                eventFactory.bind(this)(event, eventTypes.FAILURE, payload);
                errorCallback(e, 'updateProduct failure');
            });
    },

    deleteProduct (product, wishlist) {
        const event = events.MODIFY_PRODUCT;
        const payload = { type: 'delete', product };
        this.dispatch(event, payload);

        const data = cleanseOutgoingParams(product);
        API.deleteProduct(data, wishlist)
            .then(() => {
                    eventFactory.bind(this)(event, eventTypes.SUCCESS, payload);
                },
                (e) => {
                    eventFactory.bind(this)(event, eventTypes.FAILURE, payload);
                    errorCallback(e, 'deleteProduct failure');
                });
    },

    getWishlists () {
        const event = events.FETCH_WISHLISTS;
        this.dispatch(event);

        API.fetchCollection({ resource: 'wishlists' })
            .then(({ body }) => {
                eventFactory.bind(this)(event, eventTypes.SUCCESS, body);
            }, errorCallback);
    },

    userLogin ({ email, password }) {
        const event = events.USER_LOGIN;
        this.dispatch(event);

        API.userLogin({ email, password })
            .then(({ body }) => {
                eventFactory.bind(this)(event, eventTypes.SUCCESS, body);
            }, errorCallback);
    }
};

module.exports = actions;