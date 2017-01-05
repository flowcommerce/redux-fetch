import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import Application from '../components/Application';
import HomeTimeline from '../components/HomeTimeline';
import UserTimeline from '../components/UserTimeline';

export default function configureRoutes() {
  return (
    <Route path="/" component={Application}>
      <IndexRedirect to="/timeline" />
      <Route path="/timeline" component={HomeTimeline} />
      <Route path="/user/timeline" component={UserTimeline} />
    </Route>
  );
}
