import PropTypes from 'prop-types';
import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetch } from '@flowio/redux-fetch';

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

function getAsyncState(dispatch) {
  return dispatch(fetchUserTimeline());
}

function mapStateToProps(state) {
  return {
    timeline: getUserTimeline(state),
  };
}

export default compose(
  fetch(getAsyncState),
  connect(mapStateToProps),
)(UserTimeline);
