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
const Product = require('../components/Product');
const List = require('../components/List');

/* Styles */
require('style/wishlist');
/* ------ */

const AppContainer = React.createClass({
    displayName: 'AppContainer',

    mixins: [
        core.FluxMixin,
        core.StoreWatchMixin('Core', 'Products', 'Wishlists')
    ],

    getStateFromFlux () {
        const productsStore = core.store('Products');
        const wishlistsStore = core.store('Wishlists');

        return {
            started: core.store('Core').hasStarted(),
            wishlists: wishlistsStore.getWishlists(),
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
        core.actions.getWishlists();
    },

    _renderAddURL () {
        // Add a default value to the form field
        const props = {
            inputDefaultValue: this.state.addURL
        };

        return <AddURL key="add-url" onHandleInput={ this.onHandleInputForAddURL } onAdd={ this.onAddURL } { ...props } />
    },

    _renderAddProduct () {
        return (
            <div classNames="add-product">
                <Product
                    key="add-product"
                    mode="display"
                    onAddProduct={ this.onAddProduct }
                    product={ this.state.productToAdd }
                />
                <Button key="add-product-save" text="Save" onClick={ this.onAddProduct } />
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
            <div className="wishlist-products">
                { (_.size(this.state.wishlists) > 0) ? this._renderWishlists() : null }
                { this._renderAddURL() }
                { (this.state.productToAdd) ? this._renderAddProduct() : null }
                { (_.size(this.state.products) > 0) ? this._renderWishlist() : null }
            </div>
        );
    }
});

module.exports = AppContainer;
