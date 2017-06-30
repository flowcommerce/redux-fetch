import { combineReducers } from 'redux';
import { reducer as fetch } from '@flowio/redux-fetch';
import { routerReducer as routing } from 'react-router-redux';

import authorization from './authorization';
import homeTimeline from './homeTimeline';
import user from './user';
import userTimeline from './userTimeline';

export default combineReducers({
  authorization,
  fetch,
  homeTimeline,
  routing,
  user,
  userTimeline,
});
