import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { fetchReducer as fetching } from '../../../../src';
import authorization from './authorization';
import homeTimeline from './home-timeline';
import user from './user';
import userTimeline from './user-timeline';

export default combineReducers({
  authorization,
  homeTimeline,
  fetching,
  routing,
  user,
  userTimeline,
});
