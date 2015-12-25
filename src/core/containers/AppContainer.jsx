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
const paths = require('../../../enums.paths');

// Components
const AddURL = require('../components/AddURL');
const Button = require('../components/Button');
const WishlistItem = require('../components/WishlistItem');
const List = require('../components/List');

/* Styles */
require('style/wishlist');
/* ------ */

const AppContainer = React.createClass({
    displayName: 'AppContainer',

    mixins: [
        core.FluxMixin,
        core.StoreWatchMixin('Core', 'Items', 'Wishlists')
    ],

    getStateFromFlux () {
        return {
            started: core.store('Core').hasStarted(),
            wishlists: core.store('Wishlists').getWishlists(),
            wishlistItemToAdd: core.store('Items').getItemToAdd(),
            wishlistItems: core.store('Items').getItems(),
            addURL: ''
        };
    },

    onAddURL () {
        // Only honour if stateFromFlux has an addURL value triggered by a change event on input field.
        if (this.state.addURL) {
            core.actions.addURL( this.state.addURL );
        }
    },

    onHandleInputForAddURL (e, url) {
        this.setState({ addURL: url });
    },

    onAddItem (e) {
        e.preventDefault();
        core.actions.addWishlistItem( this.state.wishlistItemToAdd );
    },

    onClickItem (e) {
        e.preventDefault();
        console.info('onClickItem handler');
    },

    componentDidMount () {
        core.actions.getWishlistItems();
        core.actions.getWishlists();
    },

    _renderAddURL () {
        // Add a default value to the form field
        const props = {
            inputDefaultValue: this.state.addURL
        };

        return <AddURL key="add-url" onHandleInput={ this.onHandleInputForAddURL } onAdd={ this.onAddURL } { ...props } />
    },

    _renderAddItem () {
        return (
            <div classNames="add-item">
                <WishlistItem
                    key="add-item"
                    mode="display"
                    onAddItem={ this.onAddItem }
                    item={ this.state.wishlistItemToAdd }
                />
                <Button key="add-item-save" text="Save" onClick={ this.onAddItem } />
            </div>
        );
    },

    _renderWishlist () {
        const wishlistItems = _.map(this.state.wishlistItems, (item, index) => {
            return <WishlistItem
                key={ `wishlist-item-${index + 1}` }
                mode="display"
                item={ _.merge(_.clone(item), { onClick: this.onClickItem }) }
            />;
        });

        return <List key="products" items={ wishlistItems } />
    },

    _renderWishlists () {
        const wishlists = _.map(this.state.wishlists, (item) => {
            return {
                name: item.name,
                link: {
                    url: paths.wishlists.wishlist.replace(':title', item.name.toLowerCase())
                }
            }
        });

        return <List key="wishlists" items={ wishlists } />;
    },

    render () {
        return (
            <div className="wishlist-items">
                { (_.size(this.state.wishlists) > 0) ? this._renderWishlists() : null }

                { this._renderAddURL() }
                { (this.state.wishlistItemToAdd) ? this._renderAddItem() : null }
                { (_.size(this.state.wishlistItems) > 0) ? this._renderWishlist() : null }
            </div>
        );
    }
});

module.exports = AppContainer;
