import React from 'react';
import { connect } from 'react-redux';
import { fetch } from '../../../../../src';
import { fetchUserTimeline } from '../../actions/user-timeline';
import Conversation from '../conversation';
import { Grid, Row, Col } from 'react-bootstrap';

const UserTimeline = (props) => (
  <Grid>
    <Row>
      <Col>
        <Conversation conversations={props.conversations} />
      </Col>
    </Row>
  </Grid>
);

UserTimeline.propTypes = {
  conversations: React.PropTypes.arrayOf(React.PropTypes.object),
};

function getAsyncState(dispatch) {
  return dispatch(fetchUserTimeline());
}

function mapStateToProps(state) {
  return {
    conversations: state.userTimeline.conversations,
  };
}

export default fetch(getAsyncState)(connect(mapStateToProps)(UserTimeline));
