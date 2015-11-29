'use strict';

const superagent = require('superagent');
const Promise = require('native-promise-only');
const apiRoutes = require('../../routes.api.js');

let csrfToken;

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
        case 'post':
            request = superagent.post(url, data);
            break;
        default:
            request = superagent.get(url);
            break;
    }

    request.set('Accept', 'application/json; charset=utf-8');

    if (csrfToken) {
        request.set('X-CSRF-TOKEN', csrfToken);
    }

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

module.exports = {
    fetchCSRFToken () {
        xhr(apiRoutes.token)
            .then((response) => {
                csrfToken = response.body.token;
                // console.info('fetchCSRFToken', response.body.token);
            })
            .catch((e) => {
                console.warn('XHR: fetchCSRFToken error', e);
            });
    },
    fetchProduct (url, done) {
        const route = apiRoutes.productURL.replace(':url', encodeURIComponent(url));
        xhr(route, 'get', { url })
            .then((response) => {
                console.info('XHR: fetchProduct', url, response);
                done(response);
            })
            .catch((e) => {
                console.warn('XHR: fetchProduct error', e);
            });
    },
    addWishlistItem ({ user, wishlist, item }, done) {
        const url = apiRoutes.collection
            .replace(':resource', 'wishlist')
            .replace(':collection', 'myWishlist')
            .replace('/:type?', '')
            .replace('/:id?', '');

        xhr(url, 'post', { user, wishlist, item })
            .then((response) => {
                done(response);
            })
            .catch((e) => {
                console.warn('XHR: addWishlistItem error', e);
            });
    },
    fetchWishlistItems (pageNum, done) {
        const url = apiRoutes.collection
            .replace(':resource', 'wishlist')
            .replace(':collection', 'myWishlist')
            .replace(':type?', 'page')
            .replace(':id?', pageNum);

        xhr(url, 'get')
            .then((response) => {
                console.info('XHR: fetchWishlistItemsByPage', response);
                done(response);
            })
            .catch((e) => {
                console.warn('XHR: fetchWishlistItemsByPage error', e);
            });
    }

    /*,
    fetchUser (id) {
        xhr(apiRoutes.user + id)
            .then(( response ) => {
                console.info('fetchUser', id);
            }).catch((e) => {
                console.warn('fetchUser error', e);
            });
    }*/
};
