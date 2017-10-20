import { Link, Route } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './Navigation.css';

const NavigationItem = ({ children, to }) => (
  <Route path={to}>
    {({ match }) => (
      <li className={classnames(styles.item, { [styles.active]: match })}>
        <Link to={to}>{children}</Link>
      </li>
    )}
  </Route>
);

NavigationItem.displayName = 'NavigationItem';

NavigationItem.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
};

export default NavigationItem;
