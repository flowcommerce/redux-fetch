import PropTypes from 'prop-types';
import React from 'react';

export default function createMockComponent() {
  class MockComponent extends React.Component {
    render() {
      const { className, ...unhandledProps } = this.props;
      return React.createElement('div', { ...unhandledProps, className });
    }
  }

  MockComponent.displayName = 'MockComponent';

  MockComponent.propTypes = {
    className: PropTypes.string,
  };

  MockComponent.handledProps = ['className'];

  return MockComponent;
}
