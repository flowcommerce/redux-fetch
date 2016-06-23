import React from 'react';
import { map } from 'lodash';

const ConversationItem = (props) => (
  <li>
    <p>{props.user.name}</p>
    <p>{props.text}</p>
  </li>
);

const Conversation = (props) => (
  <ol>
    {map(props.conversations, (conversation, index) => (
      <ConversationItem key={index} {...conversation} />
    ))}
  </ol>
);

export default Conversation;
