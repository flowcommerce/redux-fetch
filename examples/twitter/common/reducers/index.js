import { combineReducers } from 'redux';

import authorization from './authorization';
import homeTimeline from './homeTimeline';
import user from './user';
import userTimeline from './userTimeline';

export default combineReducers({
  authorization,
  homeTimeline,
  user,
  userTimeline,
});
