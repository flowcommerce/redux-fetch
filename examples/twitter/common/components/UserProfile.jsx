import React from 'react';
import BemHelper from 'react-bem-helper';
import { Link } from 'react-router';

import { userShape } from '../utilities/propTypes';

if (process.browser) {
  require('./UserProfile.css'); // eslint-disable-line global-require
}

const classes = new BemHelper('UserProfile');

const UserProfile = ({ user }) => (
  <div {...classes()}>
    <div {...classes('background')} />
    <div {...classes('content')}>
      <img {...classes('avatar')} src={user.profile_image_url} alt={user.name} />
      <div {...classes('fields')}>
        <p {...classes('name')}>
          <Link to="/user/timeline">{user.name}</Link>
        </p>
        <p {...classes('screen-name')}>
          <Link to="/user/timeline">
@
            {user.screen_name}
          </Link>
        </p>
      </div>
      <div {...classes('stats')}>
        <dl {...classes('stat')}>
          <dt {...classes('stat-label')}>Tweets</dt>
          <dd {...classes('stat-value')}>{user.statuses_count}</dd>
        </dl>
        <dl {...classes('stat')}>
          <dt {...classes('stat-label')}>Following</dt>
          <dd {...classes('stat-value')}>{user.friends_count}</dd>
        </dl>
        <dl {...classes('stat')}>
          <dt {...classes('stat-label')}>Followers</dt>
          <dd {...classes('stat-value')}>{user.followers_count}</dd>
        </dl>
      </div>
    </div>
  </div>
);

UserProfile.displayName = 'UserProfile';

UserProfile.propTypes = {
  user: userShape.isRequired,
};

export default UserProfile;
