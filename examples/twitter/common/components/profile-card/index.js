import React from 'react';
import { Link } from 'react-router';

const ProfileCard = (props) => (
  <div className="profile-card">
    <p><Link to="/user/timeline">{props.name}</Link></p>
    <p><Link to="/user/timeline">{props.screen_name}</Link></p>
  </div>
);

ProfileCard.propTypes = {
  name: React.PropTypes.string.isRequired,
  screen_name: React.PropTypes.string.isRequired,
};

export default ProfileCard;
