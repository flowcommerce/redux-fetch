import React from 'react';
import PropTypes from 'prop-types';
import BemHelper from 'react-bem-helper';
import map from 'lodash/map';
import TimelineItem from './TimelineItem';
import { timelineShape } from '../utilities/propTypes';

if (process.browser) {
  require('./Timeline.css'); // eslint-disable-line global-require
}

const classes = new BemHelper('Timeline');

const Timeline = ({ timeline }) => (
  <ol {...classes()}>
    {map(timeline, (tweet, index) => (
      <TimelineItem key={index} tweet={tweet} />
    ))}
  </ol>
);

Timeline.displayName = 'Timeline';

Timeline.propTypes = {
  timeline: PropTypes.arrayOf(timelineShape),
};

export default Timeline;
