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
const classnames = require('classnames');
const paths = require('../../../common/enums.paths');

// Components
const AddURL = require('../components/AddURL');
const Button = require('../components/Button');
const Product = require('../components/Product');
const List = require('../components/List');

/* Styles */
require('style/wishlist');
require('style/overlay');
/* ------ */

const Wishlist = React.createClass({
    displayName: 'Wishlist',

    mixins: [
        core.FluxMixin,
        core.StoreWatchMixin('Products')
    ],

    getStateFromFlux () {
        const productsStore = core.store('Products');

        return {
            started: core.store('Core').hasStarted(),
            productToAdd: productsStore.getProductToAdd(),
            products: productsStore.getProducts(),
            isEditingProduct: productsStore.isEditing,
            isUpdatingProduct: productsStore.isUpdating(),
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

    onHandleInputForProduct (product, e, value, field) {
        console.info('onHandleInputForProduct', arguments);

        const fieldName = field.replace('product-', '');
        product[fieldName] = value;

        core.actions.editProduct(product);
    },

    onAddProduct (e) {
        e.preventDefault();
        core.actions.addProduct( this.state.productToAdd );
    },

    onClickProduct (e) {
        e.preventDefault();
        console.info('onClickProduct handler');
    },

    componentDidMount () {
        core.actions.getProducts();
    },

    _renderAddURL () {
        // Add a default value to the form field
        const props = {
            inputDefaultValue: this.state.addURL
        };

        return <AddURL key="add-url" onHandleInput={ this.onHandleInputForAddURL } onAdd={ this.onAddURL } { ...props } />
    },

    _renderAddProduct () {
        const actions = [{
            key: 'add-product-save',
            active: true,
            type: 'save',
            text: 'Save product',
            onClick: this.onAddProduct
        }];
        const product = _.merge(this.state.productToAdd, { actions: actions });

        return (
            <div classNames="add-product">
                <Product
                    key="add-product"
                    mode="edit"
                    onAddProduct={ this.onAddProduct }
                    product={ product }
                />
            </div>
        );
    },

    _renderWishlist () {
        const products = _.map(this.state.products, (product, index) => {
            let mode = 'display';
            let actions = {
                edit: { active: true, type: 'edit', text: 'Edit product' },
                save: { active: false, type: 'save', text: 'Save product' },
                delete: { active: true, type: 'delete', text: 'Remove' }
            };

            if (this.state.isEditingProduct(product.id)) {
                mode = 'edit';
                // Disable edit action & enable save action
                actions.edit.active = false;
                actions.save.active = true;
            }

            product = _.merge(
                _.clone(product),
                {
                    onClick: this.onClickProduct,
                    actions: [ actions.edit, actions.save, actions.delete ]
                }
            );

            return <Product
                key={ `product-${index + 1}` }
                mode={ mode }
                product={ product }
                onHandleInput={ this.onHandleInputForProduct.bind(this, product) }
            />;
        });

        return <List key="products" items={ products } />
    },

    render () {
        const overlayClasses = {
            overlay: true,
            'overlay--active': this.state.isEditingProduct()
        };

        return (
            <div className="wishlist">
                { this._renderAddURL() }
                { (this.state.productToAdd) ? this._renderAddProduct() : null }
                { (_.size(this.state.products) > 0) ? this._renderWishlist() : null }
                <div className={ classnames(overlayClasses) }></div>
            </div>
        );
    }
});

module.exports = Wishlist;
