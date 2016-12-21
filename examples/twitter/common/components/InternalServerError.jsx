import React from 'react';
import { Button, Col, Grid, Jumbotron, Row } from 'react-bootstrap';

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
  message: React.PropTypes.string,
  retry: React.PropTypes.func,
};

export default InternalServerError;
