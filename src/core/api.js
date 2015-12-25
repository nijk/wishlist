'use strict';

const superagent = require('superagent');
const Promise = require('native-promise-only');
const enums = require('../../enums.api.js');

let csrfToken;
let wishlist = 'fooBar';
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
 * @param url
 */
const xhr = (url, type = 'get', data = {}) => new Promise((resolve, reject) => {
    let request;
    switch (type) {
        case 'delete':
            // request = superagent.delete(url, data);
            break;
        case 'post':
            request = superagent.post(url, data);
            break;
        case 'put':
            request = superagent.put(url, data);
            break;
        default:
            request = superagent.get(url);
            break;
    }

    if ('get' !== type && csrfToken) {
        request.set('X-CSRF-TOKEN', csrfToken);
    }

    request.set('Accept', 'application/json; charset=utf-8');
    request.end(function ( err, response ) {
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

const preflightPOST = function (done) {
    if (!csrfToken) {
        return new Promise((resolve, reject) => {
            API.fetchCSRFToken().then(() => done(resolve, reject), reject);
        });
    }

    return new Promise(done);
};

const API = {
    fetchCSRFToken () {
        return xhr(enums.routes.auth.token)
            .then(({ body }) => {
                csrfToken = body.token;
                return csrfToken;
            })
            .catch((e) => {
                console.warn('XHR: fetchCSRFToken error', e);
            });
    },
    fetchProduct (url, done) {
        const route = enums.routes.product.replace(':url', encodeURIComponent(url));
        return xhr(route, 'get', { url })
            .then((response) => {
                console.info('XHR: fetchProduct', url, response);
                done(response);
            })
            .catch((e) => console.warn('XHR: fetchProduct error', e));
    },
    addWishlistItem (item) {
        const url = enums.routes.collection
            .replace(':resource', 'wishlists')
            .replace(':collection?', wishlist)
            .replace('/:type?', '')
            .replace('/:id?', '');

        const addWishlistItem = (resolve, reject) => {
            xhr(url, 'post', { user, wishlist, item })
                .then(resolve)
                .catch((e) => {
                    console.warn('XHR: addWishlistItem error', e);
                    reject(e);
                });
        };
        return preflightPOST(addWishlistItem);
    },
    fetchWishlistItems (pageNum) {
        const url = enums.routes.collection
            .replace(':resource', 'wishlists')
            .replace(':collection?', wishlist)
            .replace('/:type?', '')
            .replace('/:id?', '');

        return new Promise((resolve, reject) => xhr(url, 'get').then(resolve, reject));
    },
    fetchWishlists () {
        const url = enums.routes.collection
            .replace(':resource', 'wishlists')
            .replace('/:collection?', '')
            .replace('/:type?', '')
            .replace('/:id?', '');

        //const fetchWishlists = (resolve, reject) => xhr(url, 'get').then(resolve, reject);
        return new Promise((resolve, reject) => xhr(url, 'get').then(resolve, reject));
    }
};

module.exports = API;