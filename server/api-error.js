/**
 * wishlist - server/api-error
 *
 * Created by nijk on 05/01/2016.
 */

'use strict';

// @todo: log errors server-side

const APIError = (err = {}, req, res) => {
    err.name = `API Error`;
    err.message = err.message || 'unknown error';
    err.status = err.status || 500;

    console.warn(err.name, err.message, err.status, err);

    res.status(err.status);
    res.json(err);
};

APIError.prototype = Error.prototype;

module.exports = APIError;
