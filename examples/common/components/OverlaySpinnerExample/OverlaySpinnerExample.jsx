import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getReadyState } from '@flowio/redux-fetch';
import { renderRoutes } from 'react-router-config';
import PropTypes from 'prop-types';
import React from 'react';

import Dimmer from '../Dimmer';
import Spinner from '../Spinner';

const OverlaySpinnerExample = ({ match, readyState, route }) => (
  <div>
    <ul>
      <li>
        <Link to={match.path}>Home</Link>
      </li>
      <li>
        <Link to={`${match.path}/users`}>Users</Link>
      </li>
      <li>
        <Link to={`${match.path}/posts`}>Posts</Link>
      </li>
    </ul>
    <hr />
    <div>
      {renderRoutes(route.routes)}
    </div>
    {readyState === 'loading' && (
      <Dimmer>
        <Spinner />
      </Dimmer>
    )}
  </div>
);

OverlaySpinnerExample.displayName = 'OverlaySpinnerExample';

OverlaySpinnerExample.propTypes = {
  match: PropTypes.object.isRequired,
  readyState: PropTypes.string.isRequired,
  route: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  readyState: getReadyState()(state),
});

export default connect(mapStateToProps)(OverlaySpinnerExample);
