import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';

const InternalServerError = ({ error, retry }) => (
  <div>
    <h1>Internal Server Error</h1>
    <p>An error has occured while trying to fulfill your request.</p>
    <pre><code>{error}</code></pre>
    <Button onClick={retry}>Reload Page</Button>
  </div>
);

InternalServerError.displayName = 'InternalServerError';

InternalServerError.propTypes = {
  error: PropTypes.string,
  retry: PropTypes.func,
};

export default InternalServerError;
