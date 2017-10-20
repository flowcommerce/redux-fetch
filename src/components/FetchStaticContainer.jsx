import PropTypes from 'prop-types';
import React from 'react';

class FetchStaticContainer extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !!nextProps.shouldUpdate;
  }

  render() {
    const { children } = this.props;
    return children ? React.Children.only(children) : null;
  }
}

FetchStaticContainer.displayName = 'FetchStaticContainer';

FetchStaticContainer.propTypes = {
  children: PropTypes.node,
  shouldUpdate: PropTypes.bool,
};

export default FetchStaticContainer;
