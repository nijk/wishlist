/**
 * wishlist - core.components/AddItem
 *
 * Created by nijk on 08/11/15.
 */

'use strict';

const _ = require('lodash');
const classnames = require('classnames');
const React = require('react');
const { Link } = require('react-router');

// Components
const List = require('./List');
const Text = require('./Text');

/* Styles */
//require('style/menu');
/* ------ */

module.exports = React.createClass({
    displayName: 'Menu',

    propTypes: {
        title: React.PropTypes.string,
        items: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                name: React.PropTypes.string.isRequired,
                link: React.PropTypes.shape({
                    title: React.PropTypes.string,
                    url: React.PropTypes.string.isRequired
                }),
                classes: React.PropTypes.objectOf(React.PropTypes.bool)
            })
        )
    },

    createLinks (items) {
        return _.map(items, (item, index) => {
            return (
                <li key={ `menu-item-${index+1}` } className="menu__item">
                    <Link
                        key="link"
                        to={ item.link.url }
                        title={ item.link.title }
                        className="menu__link"
                        activeClassName="menu__link--active"
                    >
                    { item.name }
                    </Link>
                </li>
            );
        });
    },

    render () {
        const menu = {
            title: this.props.title,
            items: this.createLinks(this.props.items),
            className: this.props.className ? `menu ${this.props.className}` : 'menu'
        };

        return (
            <nav className={ menu.className }>
                { menu.title ? <Text tag="h2" text={ menu.title } /> : null }
                <List className="menu__list" items={ menu.items } />
            </nav>
        );
    }
});
