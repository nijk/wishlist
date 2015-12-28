/**
 * wishlist - core.components/AddProduct
 *
 * Created by nijk on 08/11/15.
 */

'use strict';

const _ = require('lodash');
const core = require('core/Core');
const React = require('react');
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
                    type: React.PropTypes.oneOf(['edit', 'save', 'delete']),
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
                    handler = core.actions.editProduct;
                    break;
                case 'save':
                    handler = core.actions.updateProduct;
                    break;
                case 'delete':
                    handler = core.actions.deleteProduct;
                    break;
                default:
                    handler = () => console.warn('Product handlerFn not defined');
            }
        }

        return handler.bind(this, this.props.product);
    },

    _renderActions () {
        if (!this.props.product.actions || 0 === this.props.product.actions.length) {
            return null;
        }

        return (
            <div className="product__actions">
                { _.map(this.props.product.actions, (action, index) => {
                    if (action.active) {
                        return <Button
                            key={`product-action-${index + 1}`}
                            className="product__action"
                            text={ action.text }
                            onClick={ this.clickHandler(action.onClick || action.type) }
                        />
                    }
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
                </div>
                { this._renderActions() }
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
                        name="product-title"
                        value={ this.props.product.description }
                        onChange={ this.props.onHandleInput }
                    />
                </div>
                { this._renderActions() }
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
