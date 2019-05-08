import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Col, Grid, Jumbotron, Row,
} from 'react-bootstrap';

const InternalServerError = ({ message, retry, ...otherProps }) => (
  <Grid>
    <Row>
      <Col>
        <Jumbotron {...otherProps}>
          <h1>Internal Server Error</h1>
          <p>An error has occured while trying to fulfill your request.</p>
          <pre>
            <code>{message}</code>
          </pre>
          <Button onClick={retry}>Reload Page</Button>
        </Jumbotron>
      </Col>
    </Row>
  </Grid>
);

InternalServerError.displayName = 'InternalServerError';

InternalServerError.propTypes = {
  message: PropTypes.string,
  retry: PropTypes.func,
};

export default InternalServerError;
