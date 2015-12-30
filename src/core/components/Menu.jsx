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
        classes: React.PropTypes.shape({
            nav: React.PropTypes.objectOf(React.PropTypes.string),
            list: React.PropTypes.objectOf(React.PropTypes.string)
        }),
        menu: React.PropTypes.shape({
            title: React.PropTypes.string,
            items: React.PropTypes.arrayOf(
                React.PropTypes.shape({
                    name: React.PropTypes.string.isRequired,
                    link: React.PropTypes.shape({
                        title: React.PropTypes.string,
                        url: React.PropTypes.string.isRequired
                    }),
                    classes: React.PropTypes.objectOf(React.PropTypes.string)
                })
            )
        })
    },

    createLinks (items) {
        return _.map(items, (item, index) => {
            return (
                <li key={ `menu-item-${index+1}` }>
                    <Link
                        key="link"
                        to={ item.link.url }
                        title={ item.link.title }
                        className="menu-item"
                        activeClassName="menu-item--active"
                    >
                    { item.name }
                    </Link>
                </li>
            );
        });
    },

    render () {
        const menu = {
            title: this.props.menu.title,
            tag: this.props.type || 'ul',
            items: this.createLinks(this.props.menu.items),
            classes: {}
        };

        if (this.props.classes) {
            menu.classes.nav = (this.props.classes && this.props.classes.nav) ? classnames(this.props.classes.nav) : null;
            menu.classes.list = (this.props.classes && this.props.classes.list) ? classnames(this.props.classes.list) : null;
        }

        return (
            <nav className={ menu.classes.nav }>
                { menu.title ? <Text tag="h2" text={ menu.title } /> : null }
                <List className={ menu.classes.list } items={ menu.items } />
            </nav>
        );
    }
});
