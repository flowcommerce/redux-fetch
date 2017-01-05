import React from 'react';
import { Button } from 'react-bootstrap';

const Login = () => (
  <Button href="/auth/twitter">Login with Twitter</Button>
);

Login.displayName = 'Login';

export default Login;
