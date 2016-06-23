import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import App from '../components/app';
import HomeTimeline from '../components/home-timeline';
import UserTimeline from '../components/user-timeline';

export default (
  <Route path="/" component={App}>
    <IndexRedirect to="/timeline" />
    <Route path="/timeline" component={HomeTimeline} />
    <Route path="/user/timeline" component={UserTimeline} />
  </Route>
);
