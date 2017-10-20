import { combineReducers } from 'redux';
import { reducer as fetch } from '@flowio/redux-fetch';
import posts from './posts';
import users from './users';

export default combineReducers({
  entities: combineReducers({
    posts,
    users,
  }),
  fetch,
});
