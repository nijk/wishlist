/**
 * wishlist - server/api-error
 *
 * Created by nijk on 05/01/2016.
 */

'use strict';

// @todo: log errors server-side
module.exports = {
    apiError (err, errCode, msg, res) {
        const errName = 'API Error';
        const errResponse = { msg: `${errName}: ${msg}`, status: errCode, error: err.message };
        res.status(errCode);
        res.json(errResponse);
        res.end();
    }
};