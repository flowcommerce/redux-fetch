import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert, Col, Grid, Row,
} from 'react-bootstrap';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withFetch } from '@flowio/redux-fetch';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

import Timeline from './Timeline';
import UserProfile from './UserProfile';
import { errorShape, userShape, timelineShape } from '../utilities/propTypes';
import getHomeTimeline from '../selectors/getHomeTimeline';
import getHomeTimelineErrors from '../selectors/getHomeTimelineErrors';
import getUser from '../selectors/getUser';
import fetchUser from '../actions/fetchUser';
import fetchHomeTimeline from '../actions/fetchHomeTimeline';

const HomeTimeline = ({ errors, user, timeline }) => (
  <Grid>
    {isEmpty(errors) ? (
      <Row>
        <Col md={4}>
          <UserProfile user={user} />
        </Col>
        <Col md={8}>
          <Timeline timeline={timeline} />
        </Col>
      </Row>
    ) : (
      <Row>
        <Col md={12}>
          {map(errors, (error, index) => (
            <Alert key={index} bsStyle="danger">
              <h4>Oh snap! You got an error!</h4>
              {error.message}
            </Alert>
          ))}
        </Col>
      </Row>
    )}
  </Grid>
);

HomeTimeline.displayName = 'HomeTimeline';

HomeTimeline.propTypes = {
  errors: PropTypes.arrayOf(errorShape),
  user: userShape.isRequired,
  timeline: PropTypes.arrayOf(timelineShape),
};

function fetchAsyncState(dispatch) {
  return Promise.all([
    dispatch(fetchUser()),
    dispatch(fetchHomeTimeline()),
  ]);
}

function mapStateToProps(state) {
  return {
    errors: getHomeTimelineErrors(state),
    user: getUser(state),
    timeline: getHomeTimeline(state),
  };
}

export default compose(
  withFetch(fetchAsyncState),
  connect(mapStateToProps),
)(HomeTimeline);
