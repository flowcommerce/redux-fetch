import React from 'react';
import BemHelper from 'react-bem-helper';
import { timelineShape } from '../utilities/propTypes';

if (process.browser) {
  require('./TimelineItem.css'); // eslint-disable-line global-require
}

const classes = new BemHelper('TimelineItem');

const TimelineItem = ({ tweet }) => (
  <li {...classes()}>
    <div {...classes('media')}>
      <img src={tweet.user.profile_image_url} alt={tweet.user.name} />
    </div>
    <div {...classes('content')}>
      <p>
        <strong {...classes('fullname')}>{tweet.user.name}</strong>
        <span {...classes('username')}>
@
          {tweet.user.screen_name}
        </span>
      </p>
      <p>{tweet.text}</p>
    </div>
  </li>
);

TimelineItem.displayName = 'TimelineItem';

TimelineItem.propTypes = {
  tweet: timelineShape.isRequired,
};

export default TimelineItem;
