import { mount } from 'enzyme';
import React from 'react';
import createMockComponent from '../../helpers/createMockComponent';
import withFetch from '../../../src/components/withFetch';

describe('withFetch', () => {
  it('should assign `fetchData` as a static property', () => {
    const fetchData = sinon.stub();
    const Component = createMockComponent();
    const Container = withFetch(fetchData)(Component);
    expect(Container).to.have.property('fetchData', fetchData);
  });

  it('should provide unhandled props to wrapped component', () => {
    const fetchData = sinon.stub();
    const Component = createMockComponent();
    const Container = withFetch(fetchData)(Component);
    const wrapper = mount(<Container id="foo" />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div').prop('id')).to.equal('foo');
  });

  it('should copy non-react statics from wrapped component', () => {
    const fetchData = sinon.stub();
    const Component = createMockComponent();
    const Container = withFetch(fetchData)(Component);
    expect(Container).to.have.property('handledProps', Component.handledProps);
  });
});
