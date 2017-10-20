import { renderRoutes } from 'react-router-config';
import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

import Sidebar from '../Sidebar';
import styles from './Application.css';

const Application = ({ routes }) => (
  <div className={classnames(styles.layout)}>
    <div className={classnames(styles.sidebar)}>
      <Sidebar />
    </div>
    <div className={classnames(styles.mainContent)}>
      {renderRoutes(routes)}
    </div>
  </div>
);

Application.displayName = 'Application';

Application.propTypes = {
  routes: PropTypes.array.isRequired,
};

export default Application;
