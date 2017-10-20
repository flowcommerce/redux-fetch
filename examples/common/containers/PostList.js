import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withFetch } from '@flowio/redux-fetch';

import { fetchPosts } from '../actions';
import { getPosts } from '../selectors';
import PostList from '../components/PostList';

const fetchData = dispatch => dispatch(fetchPosts());

const mapStateToProps = createStructuredSelector({
  posts: getPosts,
});

export default withFetch(fetchData)(connect(mapStateToProps)(PostList));
