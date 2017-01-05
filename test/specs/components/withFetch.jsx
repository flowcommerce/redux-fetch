import React, { Component, PropTypes } from 'react';
import { mount } from 'enzyme';
import createMockFetch from '../../utilities/createMockFetch';
import withFetch from '../../../src/components/withFetch';

describe('withFetch', () => {
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
    static propTypes = {
      error: PropTypes.shape({
        message: PropTypes.string.isRequired,
      }).isRequired,
    };

    render() {
      return (<div>{this.props.error.message}</div>);
    }
  }

  function mountWithContext(node, context) {
    return mount(node, {
      context: {
        fetch: createMockFetch(context),
      },
    });
  }


  it('should assign `getAsyncState` as a static property', () => {
    const getAsyncState = sinon.stub();

    @withFetch(getAsyncState)
    class Container extends Component {
      render() {
        return (<Passthrough {...this.props} />);
      }
    }

    expect(Container).to.have.property('getAsyncState').that.is.equal(getAsyncState);
  });

  it('should render loading component while fetching data requirements', () => {
    const getAsyncState = sinon.stub();

    @withFetch(getAsyncState, { renderLoading: () => <Spinner /> })
    class Container extends Component {
      render() {
        return (<Passthrough {...this.props} />);
      }
    }

    const wrapper = mountWithContext(<Container />, { fetching: true });

    expect(wrapper.find(Passthrough)).to.have.length(0);
    expect(wrapper.find(Spinner)).to.have.length(1);
  });

  it('should render failure component if an error is incurred', () => {
    const getAsyncState = sinon.stub();

    @withFetch(getAsyncState, { renderFailure: error => <Glitch error={error} /> })
    class Container extends Component {
      render() {
        return (<Passthrough {...this.props} />);
      }
    }

    const wrapper = mountWithContext(<Container />, { error: new Error('something went wrong') });

    expect(wrapper.find(Passthrough)).to.have.length(0);
    expect(wrapper.find(Glitch)).to.have.length(1);
  });

  it('should render success component when specified', () => {
    const getAsyncState = sinon.stub();

    @withFetch(getAsyncState, { renderSuccess: () => (<Tada />) })
    class Container extends Component {
      render() {
        return (<Passthrough {...this.props} />);
      }
    }

    const wrapper = mountWithContext(<Container />);

    expect(wrapper.find(Tada)).to.have.length(1);
    expect(wrapper.find(Passthrough)).to.have.length(0);
  });

  it('should render child component after required data is fulfilled', () => {
    const getAsyncState = sinon.stub();

    @withFetch(getAsyncState)
    class Container extends Component {
      render() {
        return (<Passthrough {...this.props} />);
      }
    }

    const wrapper = mountWithContext(<Container />);

    expect(wrapper.find(Passthrough)).to.have.length(1);
  });
});
