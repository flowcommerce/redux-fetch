import React from 'react';
import Spinner from 'react-spinner';
import BemHelper from 'react-bem-helper';
import { connect } from 'react-redux';
import { getIsReadyStatePending, getIsReadyStateLoading } from '@flowio/redux-fetch';
import Header from './Header';

if (process.browser) {
  require('react-spinner/react-spinner.css');
  require('./Application.css');
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
  children: React.PropTypes.node,
};

const mapStateToProps = state => ({
  loading: getIsReadyStateLoading(state) || getIsReadyStatePending(state),
});

export default connect(mapStateToProps)(Application);
