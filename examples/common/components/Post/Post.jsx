import React from 'react';
import JsonPlaceholderPropTypes from '../../utilities/JsonPlaceholderPropTypes';

const Post = ({ post }) => (
  <article>
    <h1>{post.title}</h1>
    <p>{post.body}</p>
  </article>
);

Post.displayName = 'Post';

Post.propTypes = {
  post: JsonPlaceholderPropTypes.Post.isRequired,
};

export default Post;
