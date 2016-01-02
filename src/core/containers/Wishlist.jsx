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
const events = require('../events');
const { queryLimit } = require('../../../common/enums.api');

// Components
const AddURL = require('../components/AddURL');
const Button = require('../components/Button');
const Product = require('../components/Product');
const List = require('../components/List');
const Text = require('../components/Text');
const VisibilitySensor = require('react-visibility-sensor');

/* Styles */
require('style/wishlist');
require('style/overlay');
/* ------ */

module.exports = React.createClass({
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
            productCount: productsStore.productCount(),
            canFetchMoreProducts: productsStore.canFetchMore(),
            isEditingProduct: productsStore.isEditing,
            isUpdatingProduct: productsStore.isUpdating(),
            isFetchingProducts: productsStore.isFetching(),
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
        const fieldName = field.replace('product-', '');
        product[fieldName] = value;

        core.actions.editProduct(product);
    },

    onAddProduct (e) {
        e.preventDefault();
        core.actions.addProduct( this.state.productToAdd, this.props.params.wishlist );
    },

    onClickProduct (e) {
        e.preventDefault();
        console.info('onClickProduct handler');
    },

    getProducts () {
        const remainder = this.state.productCount % queryLimit;
        const params = {
            limit: ((this.state.productCount - remainder) + queryLimit)
        };
        core.actions.getProducts(this.props.params.wishlist, params);
    },

    componentDidMount () {
        this.getProducts();

        core.store('Products').on(events.MODIFY_PRODUCT_SUCCESS, () => setTimeout(this.getProducts));
    },

    _renderAddURL () {
        // Add a default value to the form field
        const value = !!this.state.productToAdd ? '' : this.state.addURL;

        return <AddURL key="add-url" onHandleInput={ this.onHandleInputForAddURL } onAdd={ this.onAddURL } inputValue={ value } />
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
                    params={ this.props.params }
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
                params={ this.props.params }
                mode={ mode }
                product={ product }
                onHandleInput={ this.onHandleInputForProduct.bind(this, product) }
            />;
        });

        return <List key="products" items={ products } />
    },

    _renderFooter () {
        return (
            <footer>
                <VisibilitySensor delay={ 800 } onChange={ this.loadMore }/>
                <Text tag="p" text="Loading..." className="loading-more"/>
            </footer>
        );
    },

    loadMore (isVisible) {
        if ( isVisible && this.state.canFetchMoreProducts ) {
            this.getProducts();
        }
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
                { this.state.canFetchMoreProducts ? this._renderFooter() : null }
                <div className={ classnames(overlayClasses) }></div>
            </div>
        );
    }
});
