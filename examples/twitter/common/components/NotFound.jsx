import React from 'react';
import {
  Col, Grid, Jumbotron, Row,
} from 'react-bootstrap';
import { Link } from 'react-router';

const NotFound = () => (
  <Grid>
    <Row>
      <Col>
        <Jumbotron>
          <h1>Not Found</h1>
          <p>This is not the webpage that you are looking for.</p>
          <Link to="/">Home</Link>
        </Jumbotron>
      </Col>
    </Row>
  </Grid>
);

NotFound.displayName = 'NotFound';

export default NotFound;
