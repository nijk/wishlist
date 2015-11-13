/**
 * wishlist - core.containers/AppContainer
 *
 * Created by nijk on 05/11/15.
 */

'use strict';

const _ = require('lodash');
const core = require('core/Core');
const React = require('react');
const WishlistItem = require('../components/WishlistItem');

const AppContainer = React.createClass({
    displayName: 'AppContainer',

    mixins: [
        core.FluxMixin,
        core.StoreWatchMixin('Core', 'Items')
    ],

    getStateFromFlux () {
        return {
            started: core.store('Core').hasStarted(),
            wishlistItems: core.store('Items').getItems(),
            addURL: ''
        };
    },

    onAddURL () {
        if (this.state.addURL) {
            core.actions.addURL( this.state.addURL );
        }
    },

    onHandleInputForAddURL (e, url) {
        this.setState({ addURL: url });
    },

    onAddAnotherItem (e) {
        e.preventDefault();
        console.info('onAddAnotherItem handler');
    },

    onClickItem (e) {
        e.preventDefault();
        console.info('onClickItem handler');
    },

    _renderAddURL () {
        // Set the defaultValue/value depending on the state of the component.
        const addURL = this.state.addURL;
        const props = {};
        (addURL === '') ? props.inputDefaultValue = addURL : props.url = addURL;

        return <WishlistItem
                key="add-item"
                mode="edit"
                onHandleInput={ this.onHandleInputForAddURL }
                onAdd={ this.onAddURL }
                onAddAnother={ this.onAddAnotherItem }
                { ...props }
            />;
    },

    _renderWishlistItem (item, index) {
        return <WishlistItem
                key={ `wishlist-item-${index + 1}` }
                mode="display"
                item={ _.merge(_.clone(item), { onClick: this.onClickItem }) }
            />;
    },

    render () {
        return (
            <div>
                { this._renderAddURL() }
                { (this.state.wishlistItems.length > 0) ? _.map(this.state.wishlistItems, this._renderWishlistItem) : null }
            </div>
        );
    }
});

module.exports = AppContainer;
