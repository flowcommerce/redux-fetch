import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import styles from './Dimmer.css';

const Dimmer = ({ children, className, ...unhandledProps }) => (
  <div {...unhandledProps} className={classnames(styles.dimmer, className)}>
    {children}
  </div>
);

Dimmer.displayName = 'Dimmer';

Dimmer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Dimmer.defaultProps = {
  className: '',
};

export default Dimmer;
