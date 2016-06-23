import React from 'react';
import { Button } from 'react-bootstrap';

export default class Login extends React.Component {
  render() {
    return (
      <Button href="/auth/twitter">Login with Twitter</Button>
    );
  }
}
