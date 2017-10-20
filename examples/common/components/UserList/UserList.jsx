import PropTypes from 'prop-types';
import React from 'react';
import map from 'lodash/map';
import JsonPlaceholderPropTypes from '../../utilities/JsonPlaceholderPropTypes';

const UserList = ({ users }) => (
  <ul>
    {map(users, user => (
      <li key={user.id}>
        {user.name}
      </li>
    ))}
  </ul>
);

UserList.displayName = 'UserList';

UserList.propTypes = {
  users: PropTypes.arrayOf(JsonPlaceholderPropTypes.User).isRequired,
};

export default UserList;
