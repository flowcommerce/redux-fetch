import { getPosts, getPostById } from '../services/JsonPlaceholderWebApi';
import ActionTypes from '../constants/ActionTypes';

export function fetchPostsRequest() {
  return {
    type: ActionTypes.FETCH_POSTS_REQUEST,
  };
}

export function fetchPostsSuccess(posts) {
  return {
    type: ActionTypes.FETCH_POSTS_SUCCESS,
    payload: posts,
  };
}

export function fetchPostsFailure(error) {
  return {
    type: ActionTypes.FETCH_POSTS_FAILURE,
    payload: error,
    error: true,
  };
}

export function fetchPosts() {
  return function fetchPostsSideEffects(dispatch) {
    dispatch(fetchPostsRequest());
    return getPosts().then((response) => {
      dispatch(fetchPostsSuccess(response));
    }).catch((error) => {
      dispatch(fetchPostsFailure(error));
    });
  };
}

export function fetchPostByIdRequest(postId) {
  return {
    type: ActionTypes.FETCH_POST_REQUEST,
    meta: { postId },
  };
}

export function fetchPostByIdSuccess(postId, post) {
  return {
    type: ActionTypes.FETCH_POST_SUCCESS,
    payload: post,
    meta: { postId },
  };
}

export function fetchPostByIdFailure(postId, error) {
  return {
    type: ActionTypes.FETCH_POST_FAILURE,
    payload: error,
    meta: { postId },
    error: true,
  };
}

export function fetchPostById(postId) {
  return function fetchPostByIdSideEffects(dispatch) {
    dispatch(fetchPostByIdRequest(postId));
    return getPostById(postId).then((response) => {
      dispatch(fetchPostByIdSuccess(postId, response));
    }).catch((error) => {
      dispatch(fetchPostByIdFailure(postId, error));
    });
  };
}
