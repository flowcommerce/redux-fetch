import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-bootstrap';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withFetch } from '@flowio/redux-fetch';

import Timeline from './Timeline';
import { timelineShape } from '../utilities/propTypes';
import getUserTimeline from '../selectors/getUserTimeline';
import fetchUserTimeline from '../actions/fetchUserTimeline';

const UserTimeline = ({ timeline }) => (
  <Grid>
    <Row>
      <Col>
        <Timeline timeline={timeline} />
      </Col>
    </Row>
  </Grid>
);

UserTimeline.propTypes = {
  timeline: PropTypes.arrayOf(timelineShape),
};

function fetchAsyncState(dispatch) {
  return dispatch(fetchUserTimeline());
}

function mapStateToProps(state) {
  return {
    timeline: getUserTimeline(state),
  };
}

export default compose(
  withFetch(fetchAsyncState),
  connect(mapStateToProps),
)(UserTimeline);
