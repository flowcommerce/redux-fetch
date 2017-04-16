import PropTypes from 'prop-types';
import React from 'react';

import Header from './Header';

const Application = ({ children }) => (
  <div>
    <Header />
    {children}
  </div>
);

Application.displayName = 'Application';

Application.propTypes = {
  children: PropTypes.node,
};

export default Application;
