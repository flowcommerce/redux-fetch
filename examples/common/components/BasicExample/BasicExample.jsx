import { Link } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import PropTypes from 'prop-types';
import React from 'react';

const BasicExample = ({ route }) => (
  <div>
    <ul>
      <li>
        <Link to="/examples/basic">Home</Link>
      </li>
      <li>
        <Link to="/examples/basic/users">Users</Link>
      </li>
      <li>
        <Link to="/examples/basic/posts">Posts</Link>
      </li>
    </ul>
    <hr />
    <div>
      {renderRoutes(route.routes)}
    </div>
  </div>
);

BasicExample.displayName = 'BasicExample';

BasicExample.propTypes = {
  route: PropTypes.object.isRequired,
};

export default BasicExample;
