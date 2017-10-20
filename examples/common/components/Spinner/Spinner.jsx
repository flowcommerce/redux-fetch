import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import styles from './Spinner.css';

const Spinner = ({ className, ...unhandledProps }) => (
  <div {...unhandledProps} className={classnames(styles.spinner, className)}>
    <div className={classnames(styles.bounce)} />
    <div className={classnames(styles.bounce)} />
  </div>
);

Spinner.displayName = 'Spinner';

Spinner.propTypes = {
  className: PropTypes.string,
};

export default Spinner;
