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
            addItemValue: ''
        };
    },

    onAddItem () {
        if (this.state.addItemValue) {
            core.actions.addItem({ value: this.state.addItemValue });
        }
    },

    onHandleInputForAddItem (e, value) {
        this.setState({ addItemValue: value });
    },

    onAddAnotherItem (e) {
        e.preventDefault();
        console.info('onAddAnotherItem handler');
    },

    onClickItem (e) {
        e.preventDefault();
        console.info('onClickItem handler');
    },

    _renderAddItem () {
        // Set the defaultValue/value depending on the state of the component.
        const addItemValue = this.state.addItemValue;
        const props = {};
        (addItemValue === '') ? props.inputDefaultValue = addItemValue : props.value = addItemValue;

        return <WishlistItem
                key="add-item"
                mode="edit"
                onHandleInput={ this.onHandleInputForAddItem }
                onAdd={ this.onAddItem }
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
                { this._renderAddItem() }
                { (this.state.wishlistItems.length > 0) ? _.map(this.state.wishlistItems, this._renderWishlistItem) : null }
            </div>
        );
    }
});

module.exports = AppContainer;
