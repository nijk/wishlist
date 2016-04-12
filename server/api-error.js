/**
 * wishlist - server/api-error
 *
 * Created by nijk on 05/01/2016.
 */

'use strict';

// @todo: log errors server-side

function APIError (err = {}, _req, res) {
    //if (!res.error) res.error = {};

    err.name = `API Error`;
    err.message = err.message || 'unknown error';
    err.status = err.status || 500;
    err.originError = err.originError || {};

    /*console.warn('api-error', res.error, next);
    next();*/
    
    res.status(err.status);
    res.json(err);
}

APIError.prototype = Error.prototype;

module.exports = {
    APIError
};
