import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

import styles from './Navigation.css';

const NavigationGroup = ({ children, heading }) => (
  <li className={classnames(styles.group)}>
    <span className={classnames(styles.heading)}>
      {heading}
    </span>
    <ul>{children}</ul>
  </li>
);

NavigationGroup.displayName = 'NavigationGroup';

NavigationGroup.propTypes = {
  children: PropTypes.node.isRequired,
  heading: PropTypes.node.isRequired,
};

export default NavigationGroup;
