import { createSelector } from 'reselect';
import get from 'lodash/get';
import values from 'lodash/values';

export const getPostEntities = state =>
  get(state, 'entities.posts');

export const getPosts = createSelector(
  getPostEntities,
  posts => values(posts),
);

export const getPostById = postId => createSelector(
  getPostEntities,
  posts => get(posts, postId),
);
