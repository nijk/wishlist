/**
 * wishlist - server/middleware/errorHandler
 *
 * Created by nijk on 28/02/2016.
 */

'use strict';

const APIErrorHandler = (req, res) => {
    const err = res.error;

    if (err) {
        const errName = err.name || 'API Error';
        const errMsg = `${errName}: ${err.msg}`;

        console.warn(errMsg, err.originError);

        res.status(err.code);
        res.json({
            msg: errMsg,
            status: err.code,
            error: err.message
        });
    }
};

const APIError = (err, req, res) => {
    res.error = err;
    res.error.code = err.code || 500;
    res.error.msg = err.msg || 'unknown error';
    APIErrorHandler(req, res);
};

module.exports = {
    APIError,
    APIErrorHandler
};
