/**
 * wishlist - core/actions
 *
 * Created by nijk on 08/11/15.
 */

'use strict';

// const core = require('./Core');
const API = require('./api');
const events = require('./events');
const eventsEnums = require('../../common/enums.events');

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
    addProduct (product) {
        const event = events.ADD_PRODUCT;
        this.dispatch(event, product);

        API.addProduct(product)
            .then(({ body }) => {
                eventFactory.bind(this, event, eventsEnums.SUCCESS, body[0])();
                actions.getProducts.bind(this)();
            },
            (e) => {
                eventFactory.bind(this, event, eventsEnums.FAILURE, {})();
                errorCallback(e, 'addProduct failure');
            });
    },
    getProducts () {
        const event = events.FETCH_PRODUCTS;
        this.dispatch(event);

        API.fetchProducts(1)
            .then(({ body }) => {
                const payload = _.map(body, cleanseIncomingParams);
                console.info('API.fetchProducts(1).then() products.body', body, payload);
                eventFactory.bind(this, event, eventsEnums.SUCCESS, payload)();
            }, errorCallback);
    },

    editProduct (product) {
        console.info('editProduct', product);

        this.dispatch(events.EDIT_PRODUCT, product);
    },

    updateProduct (product) {
        const event = events.UPDATE_PRODUCT;
        this.dispatch(event, product);

        const data = cleanseOutgoingParams(product);
        API.updateProduct(data)
            .then(({ body }) => {
                const payload = cleanseIncomingParams(body.item);
                eventFactory.bind(this, event, eventsEnums.SUCCESS, payload)();
                // Fetch all products
                actions.getProducts.bind(this)();
            },
            (e) => {
                eventFactory.bind(this, event, eventsEnums.FAILURE, {})();
                errorCallback(e, 'updateProduct failure');
            });
    },

    deleteProduct (product) {
        const event = events.DELETE_PRODUCT;
        this.dispatch(event, product);

        const data = cleanseOutgoingParams(product);
        API.deleteProduct(data)
            .then(() => {
                    eventFactory.bind(this, event, eventsEnums.SUCCESS, product)();
                    // Fetch all products
                    actions.getProducts.bind(this)();
                },
                (e) => {
                    eventFactory.bind(this, event, eventsEnums.FAILURE, {})();
                    errorCallback(e, 'deleteProduct failure');
                });
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