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

    if (csrfToken) {
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

module.exports = {
    fetchCSRFToken () {
        return xhr(apiRoutes.token)
            .then(({ body }) => {
                csrfToken = body.token;
                //console.info('fetchCSRFToken csrfToken', csrfToken, body.token);
                return csrfToken;
            })
            .catch((e) => {
                console.warn('XHR: fetchCSRFToken error', e);
            });
    },
    fetchProduct (url, done) {
        const route = apiRoutes.productURL.replace(':url', encodeURIComponent(url));
        return xhr(route, 'get', { url })
            .then((response) => {
                console.info('XHR: fetchProduct', url, response);
                done(response);
            })
            .catch((e) => {
                console.warn('XHR: fetchProduct error', e);
            });
    },
    addWishlistItem ({ user, wishlist, item }, done) {
        //console.info('addWishlistItem csrfToken', csrfToken);
        const url = apiRoutes.collection
            .replace(':resource', 'wishlist')
            .replace(':collection', 'myWishlist')
            .replace('/:type?', '')
            .replace('/:id?', '');

        return xhr(url, 'post', { user, wishlist, item })
            .then((response) => {
                done(response);
            })
            .catch((e) => {
                console.warn('XHR: addWishlistItem error', e);
            });
    },
    fetchWishlistItems (pageNum) {
        const url = apiRoutes.collection
            .replace(':resource', 'wishlist')
            .replace(':collection', 'myWishlist')
            .replace(':type?', 'page')
            .replace(':id?', pageNum);

        const fetchWishlist = (resolve, reject) => xhr(url, 'get').then(resolve, reject);

        if (csrfToken) {
            return new Promise(fetchWishlist);
        } else {
            return new Promise((resolve, reject) => {
                this.fetchCSRFToken().then(() => fetchWishlist(resolve, reject), reject);
            });
        }
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
