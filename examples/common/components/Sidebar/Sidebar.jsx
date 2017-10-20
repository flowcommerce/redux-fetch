import React from 'react';
import Navigation from '../Navigation';

const Sidebar = () => (
  <Navigation>
    <Navigation.Group heading="Examples">
      <Navigation.Item to="/examples/basic">Basic</Navigation.Item>
      <Navigation.Item to="/examples/overlay-spinner">Overlay Spinner</Navigation.Item>
    </Navigation.Group>
  </Navigation>
);

Sidebar.displayName = 'Sidebar';

export default Sidebar;
