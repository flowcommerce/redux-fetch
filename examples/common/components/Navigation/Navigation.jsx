import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

import NavigationGroup from './NavigationGroup';
import NavigationItem from './NavigationItem';
import styles from './Navigation.css';

const Navigation = ({ children }) => (
  <nav className={classnames(styles.navigation)}>
    <ul>{children}</ul>
  </nav>
);

Navigation.displayName = 'Navigation';

Navigation.propTypes = {
  children: PropTypes.node.isRequired,
};

Navigation.Item = NavigationItem;
Navigation.Group = NavigationGroup;

export default Navigation;
