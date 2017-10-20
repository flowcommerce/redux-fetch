import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import map from 'lodash/map';
import JsonPlaceholderPropTypes from '../../utilities/JsonPlaceholderPropTypes';

const PostList = ({ match, posts }) => (
  <ul>
    {map(posts, post => (
      <li key={post.id}>
        <Link to={`${match.url}/${post.id}`}>{post.title}</Link>
      </li>
    ))}
  </ul>
);

PostList.displayName = 'PostList';

PostList.propTypes = {
  match: PropTypes.object.isRequired,
  posts: PropTypes.arrayOf(JsonPlaceholderPropTypes.Post).isRequired,
};

export default PostList;
