'use strict';

const _ = require('lodash');
const superagent = require('superagent');
const Promise = require('native-promise-only');
const transform = require('../../common/transforms');
const { routes } = require('../../common/enums.api.js');

let csrfToken;
let user = 'nijk';

/**
 * Supply error name based on type i.e 4xx, 5xx
 * @param {number} errType
 * @returns {string} - error name
 */
function nameError( errType ) {
    if ( errType >= 4 ) {
        return parseInt( errType, 10 ) === 4 ? 'CLIENT_ERR' : 'SERVER_ERR';
    }
    return 'REQUEST_FAILED';
}

/**
 * Wrapper for making API requests
 * @param path
 * @param type
 * @param data
 */
const xhr = (path, type = 'get', data = {}, query = {}) => new Promise((resolve, reject) => {
    let request;
    switch (type) {
        case 'delete':
            request = superagent.del(path);
            break;
        case 'post':
            request = superagent.post(path, data);
            break;
        case 'put':
            request = superagent.put(path, data);
            break;
        default:
            request = superagent.get(path);
            break;
    }

    if (_.some(query)) {
        request.query(query);
    }

    const csrfToken = 'csrfToken';

    if ('get' !== type && csrfToken) {
        request.set('X-Requested-With', `XMLHttpRequest;${csrfToken}`);
    }

    request.set('Accept', 'application/json; charset=utf-8');
    request.end(( err, response ) => {
        if ( !err ) {
            response.body = JSON.parse( response.text );
            resolve( response );
        } else {
            reject({
                name: nameError( err.response && err.response.statusType ),
                err: err,
                response: err.response
            });
        }
    });
});

const API = {
    fetchProduct (url, done) {
        const path = transform.route(routes.PRODUCTS, { url: encodeURIComponent(url) });
        return xhr(path, 'get')
            .then((response) => {
                console.info('XHR: fetchProduct', url, response);
                done(response);
            })
            .catch((e) => console.warn('XHR: fetchProduct error', e));
    },
    addProduct (product, wishlistID) {
        const path = transform.route(routes.WISHLISTS, { id: wishlistID });
        return new Promise((resolve, reject) => {
            xhr(path, 'post', { user, item: product })
                .then(resolve)
                .catch((e) => {
                    console.warn('XHR: addProduct error', e);
                    reject(e);
                });
        });
    },
    updateProduct (product, collection) {
        const path = transform.route(routes.WISHLISTS, { collection });
        return new Promise((resolve, reject) => {
            xhr(path, 'put', { user, item: product })
                .then(resolve)
                .catch((e) => {
                    console.warn('XHR: updateProduct error', e);
                    reject(e);
                });
        });
    },
    deleteProduct (product, collection) {
        const path = transform.route(routes.WISHLISTS, { collection, id: product._id });

        return new Promise((resolve, reject) => xhr(path, 'delete', { user, item: product })
                .then(resolve)
                .catch((e) => {
                    console.warn('XHR: deleteProduct error', e);
                    reject(e);
                })
        );
    },
    fetchCollection ({ resource, id, page, limit }) {
        const path = transform.route(routes.WISHLISTS, { resource, id });
        return new Promise((resolve, reject) => xhr(path, 'get', null, { page, limit })
            .then(resolve, reject)
            .catch((e) => {
                console.warn('XHR: fetchCollection error', e);
                reject(e);
            })
        );
    },
    userLogin ({ email, password }) {
        const path = routes.LOGIN;
        return new Promise((resolve, reject) => {
            xhr(path, 'post', { email, password })
                .then(resolve)
                .catch((e) => {
                    console.warn('XHR: userLogin error', e);
                    reject(e);
                });
        });
    }
};

module.exports = API;
