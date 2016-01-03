/**
 * wishlist - core.components/AddProduct
 *
 * Created by nijk on 08/11/15.
 */

'use strict';

// Dependencies
const _ = require('lodash');
const core = require('core/Core');
const React = require('react');
const proptypes = require('core/proptypes');

// Components
const Button = require('./Button');
const Text = require('./Text');
const Input = require('./Input');

/* Styles */
require('style/add-url');
/* ------ */

const Product = React.createClass({
    displayName: 'Product',

    propTypes: {
        mode: React.PropTypes.oneOf(['display', 'edit']),
        product: React.PropTypes.shape({
            id: React.PropTypes.string,
            title: React.PropTypes.string.isRequired,
            siteName: React.PropTypes.string,
            description: React.PropTypes.string,
            url: React.PropTypes.string.isRequired,
            images: React.PropTypes.arrayOf(
                React.PropTypes.shape({
                    url: React.PropTypes.string.isRequired
                })
            ),
            onClick: React.PropTypes.func,
            actions: React.PropTypes.arrayOf(
                React.PropTypes.shape({
                    active: React.PropTypes.bool.isRequired,
                    classes: proptypes.classes,
                    type: React.PropTypes.oneOf(['edit', 'save', 'cancel', 'delete']),
                    text: React.PropTypes.string.isRequired,
                    onClick: React.PropTypes.func
                })
            )
        }),
        onAdd: React.PropTypes.func,
        onHandleInput: React.PropTypes.func
    },

    clickHandler (handler) {
        if (!_.isFunction(handler)) {
            switch (handler) {
                case 'edit':
                    handler = core.actions.editProduct.bind(this, this.props.product, this.props.params.wishlist);
                    break;
                case 'save':
                    handler = core.actions.updateProduct.bind(this, this.props.product, this.props.params.wishlist);
                    break;
                case 'cancel':
                    handler = core.actions.editProductCancel.bind(this, this.props.product);
                    break;
                case 'delete':
                    handler = core.actions.deleteProduct.bind(this, this.props.product, this.props.params.wishlist);
                    break;
                default:
                    handler = () => console.warn('Product handlerFn not defined');
            }
        }

        return handler;
    },

    _renderActions () {
        if (!this.props.product.actions || 0 === this.props.product.actions.length) {
            return null;
        }

        return (
            <div className="product__actions">
                { _.map(this.props.product.actions, (action, index) => {
                    if (!action.active) {
                        return null;
                    }

                    const classes = _.merge({
                        product__action: true,
                        button__primary: false
                    }, action.classes);

                    return (
                        <Button
                            key={ `button-action-${ index + 1 }` }
                            className={ classes }
                            prependElement={ action.prepend }
                            text={ action.text }
                            onClick={ this.clickHandler(action.onClick || action.type) }
                        />
                    );
                }) }
            </div>
        );
    },

    _renderProduct () {
        return (
            <div key={ this.props.key } className="product">
                <div className="product__media">
                    <a className="media" href={ this.props.product.url } target="_blank" onClick={ this.props.product.onClick }>
                        <img src={ this.props.product.images[0].url } title={ this.props.product.title } />
                    </a>
                </div>
                <div className="product__details">
                    <Text tag='h3' text={ this.props.product.title } />
                    <Text tag='p' text={ this.props.product.description } />
                    {
                    (this.props.product.siteName) ?
                        <a href={ this.props.product.url } target="_blank">
                            <Text tag="p" text={ `From ${this.props.product.siteName}` } />
                        </a>
                    : null
                    }
                    { this._renderActions() }
                </div>
            </div>
        );
    },

    _renderImages () {
        // Get out quick if there's nothing to render
        if ( !this.props.product.images ) { return null; }

        const images = _.map(this.props.product.images, (product, index) => {
            if (_.isString(product.url)) {
                return ( <img key={ `temp-product-${index}` } src={ product.url } alt={ product.alt || '' } /> );
            }
        }, []);

        return ( images ) ? images : null;
    },

    _renderProductEdit () {
        return (
            <div key={ this.props.key } className="product product--editing">
                <div className="product__media">{ this._renderImages() }</div>
                <div className="product__details">
                    <Input
                        type="text"
                        name="product-title"
                        value={ this.props.product.title }
                        onChange={ this.props.onHandleInput }
                    />
                    <Input
                        type="textarea"
                        name="product-description"
                        value={ this.props.product.description }
                        onChange={ this.props.onHandleInput }
                    />
                    { this._renderActions() }
                </div>
            </div>
        );
    },

    render () {
        if ('edit' === this.props.mode) {
            return this._renderProductEdit();
        }
        return this._renderProduct();
    }
});

module.exports = Product;
