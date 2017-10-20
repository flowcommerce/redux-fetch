import PropTypes from 'prop-types';
import React from 'react';

const NotFound = ({ location }) => (
  <div>
    <h3>No match for <code>{location.pathname}</code></h3>
  </div>
);

NotFound.displayName = 'NotFound';

NotFound.propTypes = {
  location: PropTypes.object.isRequired,
};

export default NotFound;
