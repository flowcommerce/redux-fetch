import { mount } from 'enzyme';
import React from 'react';
import CancellationToken from '../../../src/utilities/CancellationToken';
import FetchRenderer from '../../../src/components/FetchRenderer';
import FetchStaticContainer from '../../../src/components/FetchStaticContainer';
import ReadyState from '../../../src/constants/ReadyState';
import createMockLocation from '../../helpers/createMockLocation';
import createMockRouteConfig from '../../helpers/createMockRouteConfig';

const renderSubject = ({
  location = createMockLocation(),
  render = sinon.stub(),
  routes = createMockRouteConfig(),
  fetchDataForRoutes = sinon.stub(),
  ...unhandledProps
}) => mount(
  <FetchRenderer
    {...unhandledProps}
    fetchDataForRoutes={fetchDataForRoutes}
    location={location}
    render={render}
    routes={routes} />,
);

describe('FetchRenderer', () => {
  it('should not call `fetchDataForRoutes` when data requirements are met on mount', () => {
    const wrapper = renderSubject({ readyState: ReadyState.FULFILLED });
    expect(wrapper.prop('fetchDataForRoutes')).to.not.have.been.called;
  });

  it('should call `fetchDataForRoutes` when data requirements are not met on mount', () => {
    const wrapper = renderSubject({ readyState: ReadyState.PENDING });
    expect(wrapper.prop('fetchDataForRoutes')).to.have.been.calledOnce;
    expect(wrapper.prop('fetchDataForRoutes')).to.have.been.calledWithExactly(
      wrapper.prop('routes'),
      wrapper.prop('location').pathname,
      sinon.match.instanceOf(CancellationToken),
    );
  });

  it('should call `fetchDataForRoutes` when forced on mount', () => {
    const wrapper = renderSubject({
      forceFetch: true,
      readyState: ReadyState.FULFILLED,
    });
    expect(wrapper.prop('fetchDataForRoutes')).to.have.been.calledOnce;
  });

  it('should call `fetchDataForRoutes` when updated with a different location', () => {
    const prevLocation = createMockLocation({ pathname: '/posts/1' });
    const nextLocation = createMockLocation({ pathname: '/posts/2' });
    const wrapper = renderSubject({
      location: prevLocation,
      readyState: ReadyState.FULFILLED,
    });

    wrapper.setProps({ location: nextLocation });

    expect(wrapper.prop('fetchDataForRoutes')).to.have.been.calledOnce;
    expect(wrapper.prop('fetchDataForRoutes')).to.have.been.calledWithExactly(
      wrapper.prop('routes'),
      nextLocation.pathname,
      sinon.match.instanceOf(CancellationToken),
    );
  });

  it('should render when mounted before a request is sent', () => {
    const initialView = React.createElement('div');
    const render = sinon.stub().returns(initialView);
    const wrapper = renderSubject({ render });
    expect(render).to.have.been.calledOnce;
    expect(wrapper.find(FetchStaticContainer).prop('children')).to.equal(initialView);
  });
});
