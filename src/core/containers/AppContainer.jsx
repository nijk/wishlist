/**
 * wishlist - core.containers/AppContainer
 *
 * Created by nijk on 05/11/15.
 */

'use strict';

const _ = require('lodash');
const core = require('core/Core');
const React = require('react');
const AddURL = require('../components/AddURL');
const Button = require('../components/Button');
const WishlistItem = require('../components/WishlistItem');

/* Styles */
require('style/wishlist');
/* ------ */

const AppContainer = React.createClass({
    displayName: 'AppContainer',

    mixins: [
        core.FluxMixin,
        core.StoreWatchMixin('Core', 'Items')
    ],

    getStateFromFlux () {
        return {
            started: core.store('Core').hasStarted(),
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

    _renderWishlistItem (item, index) {
        console.info(`_renderWishlistItem #${index}`, item);
        return <WishlistItem
                key={ `wishlist-item-${index + 1}` }
                mode="display"
                item={ _.merge(_.clone(item), { onClick: this.onClickItem }) }
            />;
    },

    render () {
        return (
            <div className="wishlist-items">
                { this._renderAddURL() }
                { (this.state.wishlistItemToAdd) ? this._renderAddItem() : null }
                { (_.size(this.state.wishlistItems) > 0) ? _.map(this.state.wishlistItems, this._renderWishlistItem).reverse() : null }
            </div>
        );
    }
});

module.exports = AppContainer;
