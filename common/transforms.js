/**
 * wishlist - /transforms
 *
 * Created by nijk on 28/12/2015.
 */

'use strict';

const _ = require('lodash');

module.exports = {
    route (route, replacements) {
        route = _.map(route.split('/'), (item) => {
            if (':' !== item.charAt(0)) {
                return item;
            }

            const optional = item.indexOf('?') > -1;
            item = item.replace(/[:?]/g, '');

            if (replacements[item]) {
                return replacements[item].toLowerCase();
            } else {
                if (!optional) {
                    console.warn(`Required slug ${item} not provided in replacements`);
                }
                return;
            }
        }, []);

        return `/${ _.filter(route, (item) => !!item).join('/') }`;
    }
};
