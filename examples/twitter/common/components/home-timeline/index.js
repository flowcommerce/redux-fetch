import React from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { fetch } from '../../../../../src'; // @flowio/react-redux-fetch
import { fetchUser } from '../../actions/user';
import { fetchHomeTimeline } from '../../actions/home-timeline';
import { Grid, Row, Col } from 'react-bootstrap';
import ProfileCard from '../profile-card';
import Conversation from '../conversation';

const HomeTimeline = (props) => (
  <Grid>
    <Row>
      <Col>
        <ProfileCard {...props.user} />
      </Col>
      <Col>
        <Conversation conversations={props.conversations} />
      </Col>
    </Row>
  </Grid>
);

HomeTimeline.displayName = 'HomeTimeline';

HomeTimeline.propTypes = {
  user: React.PropTypes.object,
  conversations: React.PropTypes.arrayOf(React.PropTypes.object),
};

function getInitialAsyncState(dispatch) {
  return Promise.all([
    dispatch(fetchUser()),
    dispatch(fetchHomeTimeline()),
  ]);
}

function mapStateToProps(state) {
  return {
    user: state.user,
    conversations: state.homeTimeline.conversations,
  };
}

export default fetch(getInitialAsyncState)(connect(mapStateToProps)(HomeTimeline));
