/* eslint-disable react/jsx-no-bind */

import { MemoryRouter, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

import Button from '../Button';
import LeftArrowIcon from '../LeftArrowIcon';
import RightArrowIcon from '../RightArrowIcon';
import FileCodeIcon from '../FileCodeIcon';
import styles from './Browser.css';

const getUserConfirmation = (message, callback) => callback(window.confirm(message));

const createPath = location => location.pathname + location.search;

class Browser extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return { url: null };
  }

  handleInputChange(event) {
    this.setState({ url: event.target.value });
  }

  handleInputKeyDown(history, event) {
    if (event.key === 'Enter') {
      this.setState({ url: null });
      history.push(event.target.value);
    }
  }

  render() {
    const { url } = this.state;
    const { children, ...unhandledProps } = this.props;

    return (
      <MemoryRouter getUserConfirmation={getUserConfirmation}>
        <Route render={({ history, location }) => (
          <div {...unhandledProps} className={classnames(styles.browser)}>
            <div className={classnames(styles.toolbar)}>
              <Button className={classnames(styles.button)} onClick={history.goBack} disabled={!history.canGo(-1)} format="flat" size="small">
                <LeftArrowIcon className={classnames(styles.icon)} />
              </Button>
              <Button className={classnames(styles.button)} onClick={history.goForward} disabled={!history.canGo(1)} format="flat" size="small">
                <RightArrowIcon className={classnames(styles.icon)} />
              </Button>
              <div className={classnames(styles.fileCode)}>
                <FileCodeIcon height="1em" width="1em" className={classnames(styles.fileCodeIcon)} />
              </div>
              <div className={classnames(styles.address)}>
                <input
                  type="text"
                  className={classnames(styles.input)}
                  value={url || createPath(location)}
                  onChange={this.handleInputChange.bind(this)}
                  onKeyDown={this.handleInputKeyDown.bind(this, history)} />
              </div>
            </div>
            <div className={classnames(styles.content)}>
              {React.Children.only(children)}
            </div>
          </div>
        )} />
      </MemoryRouter>
    );
  }
}

Browser.displayName = 'Browser';

Browser.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Browser;
