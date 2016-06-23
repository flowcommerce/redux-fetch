import React from 'react';
import Header from '../header';

const App = (props) => (
  <div className="application">
    <Header />
    {props.children}
  </div>
);

App.displayName = 'App';

App.propTypes = {
  children: React.PropTypes.node,
};

export default App;
