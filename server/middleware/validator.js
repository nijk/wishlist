/**
 * wishlist - server/middleware/validator
 *
 * Created by nijk on 28/02/2016.
 */

'use strict';

const Validator = function () {

};

Validator.prototype = {
    /**
     * Checks that the requested resource is valid
     */
    resource: (req, res, next) => {
        const { resource } = req.params;

        if (!resource || !_.includes(resources, resource)) {
            const err = new Error('Invalid resource');
            err.name = '400:resource-validator';

            next(err, null);
        }
    },
    /**
     * XSS protection
     */
    xss: (req, res, next) => {
        // @todo: SECURITY handle/cleanse request data

        if (err) next(err, null);
    }
};

module.exports = (req, res, next) => {

    console.info('API Validator');

    const validator = new Validator();

    validator.resource(req, res, next);
    validator.xss(req, res, next);

    next();
};
