import React from 'react';
import PropTypes from 'prop-types';
import Spinner from 'react-spinner';
import BemHelper from 'react-bem-helper';
import { connect } from 'react-redux';
import { getIsPending, getIsLoading } from '@flowio/redux-fetch';
import Header from './Header';

if (process.browser) {
  require('react-spinner/react-spinner.css'); // eslint-disable-line global-require
  require('./Application.css'); // eslint-disable-line global-require
}

const classes = new BemHelper('Application');

const Application = ({ children, loading }) => (
  <div {...classes()}>
    {loading && (
      <div {...classes('spinner')}>
        <Spinner />
      </div>
    )}
    <Header />
    {children}
  </div>
);

Application.displayName = 'Application';

Application.propTypes = {
  children: PropTypes.node,
  loading: PropTypes.bool,
};

const mapStateToProps = state => ({
  loading: getIsLoading(state) || getIsPending(state),
});

export default connect(mapStateToProps)(Application);
