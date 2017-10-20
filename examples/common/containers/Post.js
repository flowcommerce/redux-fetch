import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withFetch } from '@flowio/redux-fetch';

import { fetchPostById } from '../actions';
import { getPostById } from '../selectors';
import Post from '../components/Post';

const fetchData = (dispatch, getState, match) =>
  dispatch(fetchPostById(match.params.id));

const mapStateToProps = createStructuredSelector({
  post: (state, props) => getPostById(props.match.params.id)(state),
});

export default compose(
  withFetch(fetchData),
  connect(mapStateToProps),
)(Post);
