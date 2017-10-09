import React, { Component } from 'react';
import { mount } from 'enzyme';
import FetchReadyStateRenderer from '../../src/FetchReadyStateRenderer';
import ReadyState from '../../src/ReadyState';

class Passthrough extends Component {
  render() {
    return (<div {...this.props} />);
  }
}

class Tada extends Component {
  render() {
    return (<div>Tada!</div>);
  }
}

class Spinner extends Component {
  render() {
    return (<div>Loading...</div>);
  }
}

class Glitch extends Component {
  render() {
    return (<div>Something went wrong...</div>);
  }
}

describe('FetchReadyStateRenderer', () => {
  it('should render loading component while fetching data requirements', () => {
    const jsx = (
      <FetchReadyStateRenderer
        readyState={ReadyState.LOADING}
        renderLoading={() => <Spinner />}>
        <Passthrough />
      </FetchReadyStateRenderer>
    );
    const wrapper = mount(jsx);

    expect(wrapper.find(Passthrough)).to.have.length(0);
    expect(wrapper.find(Spinner)).to.have.length(1);
  });


  it('should render failure component if an error is incurred', () => {
    const jsx = (
      <FetchReadyStateRenderer
        readyState={ReadyState.FAILURE}
        renderFailure={() => <Glitch />}>
        <Passthrough />
      </FetchReadyStateRenderer>
    );
    const wrapper = mount(jsx);

    expect(wrapper.find(Passthrough)).to.have.length(0);
    expect(wrapper.find(Glitch)).to.have.length(1);
  });

  it('should render success component when specified', () => {
    const jsx = (
      <FetchReadyStateRenderer
        readyState={ReadyState.SUCCESS}
        renderSuccess={() => <Tada />}>
        <Passthrough />
      </FetchReadyStateRenderer>
    );
    const wrapper = mount(jsx);

    expect(wrapper.find(Passthrough)).to.have.length(0);
    expect(wrapper.find(Tada)).to.have.length(1);
  });

  it('should render child component after required data is fulfilled', () => {
    const jsx = (
      <FetchReadyStateRenderer readyState={ReadyState.SUCCESS}>
        <Passthrough />
      </FetchReadyStateRenderer>
    );
    const wrapper = mount(jsx);

    expect(wrapper.find(Passthrough)).to.have.length(1);
  });
});
