import React, { Component } from 'react';

const spinnerStyles = {
  width: '40px',
  height: '40px',
  position: 'relative',
  margin: '100px auto',
};

const bounceStyles = {
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  backgroundColor: '#333',
  opacity: '0.6',
  position: 'absolute',
  top: 0,
  left: 0,
  transform: 'scale(0.0)',
  transitionProperty: 'transform',
  transitionDuration: '1.0s',
  transitionTimingFunction: 'ease-in-out',
};

export default class Spinner extends Component {
  static displayName = 'Spinner';

  state = {
    transitionState: 'bounceIn',
  };

  componentDidMount() {
    this.toggleTransitionState();
    this.interval = setInterval(() => {
      this.toggleTransitionState();
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  toggleTransitionState() {
    this.setState({
      transitionState: (this.state.transitionState === 'bounceIn') ? 'bounceOut' : 'bounceIn',
    });
  }

  render() {
    return (
      <div style={spinnerStyles}>
        <div
          style={Object.assign({}, bounceStyles, {
            transform: (this.state.transitionState === 'bounceIn') ? 'scale(0.0)' : 'scale(1.0)',
          })} />
        <div
          style={Object.assign({}, bounceStyles, {
            transform: (this.state.transitionState === 'bounceOut') ? 'scale(0.0)' : 'scale(1.0)',
          })} />
      </div>
    );
  }
}
