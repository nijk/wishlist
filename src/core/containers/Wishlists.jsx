/**
 * wishlist - core.containers/AppContainer
 *
 * Created by nijk on 05/11/15.
 */

'use strict';

// Dependencies
const _ = require('lodash');
const core = require('core/Core');
const React = require('react');
const transform = require('../../../common/transforms');
const paths = require('../../../common/enums.paths');

// Components
const List = require('../components/List');

/* Styles */
/* ------ */

const Wishlists = React.createClass({
    displayName: 'Wishlists',

    mixins: [
        core.FluxMixin,
        core.StoreWatchMixin('Wishlists')
    ],

    getStateFromFlux () {
        const wishlistsStore = core.store('Wishlists');

        return {
            wishlists: wishlistsStore.getWishlists()
        };
    },

    componentDidMount () {
        core.actions.getWishlists();
    },

    _renderWishlists () {
        const wishlists = _.map(this.state.wishlists, (item) => {
            return {
                name: item.name,
                link: {
                    url: transform.route(paths.wishlists.wishlist, { title: item.name.toLowerCase() })
                }
            }
        });

        return <List key="wishlists" items={ wishlists } />;
    },

    render () {
        return _.size(this.state.wishlists) > 0 ? this._renderWishlists() : null;
    }
});

module.exports = Wishlists;
