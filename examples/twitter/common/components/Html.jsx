import React from 'react';
import PropTypes from 'prop-types';

// A utility function to safely escape JSON for embedding in a <script> tag
function safeStringify(data = {}) {
  return JSON.stringify(data).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--');
}

const Html = ({
  language, markup, state, title,
}) => (
  <html lang={language}>
    <head>
      <title>{title}</title>
      <link href="/assets/images/favicon.ico" rel="shortcut icon" type="image/x-icon" />
      <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />
      <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap-theme.min.css" />
      <meta charSet="utf-8" />
    </head>
    <body>
      <div id="react-root" dangerouslySetInnerHTML={{ __html: markup }} />
      <script dangerouslySetInnerHTML={{ __html: `window.$REDUX_STATE = ${safeStringify(state)};` }} />
      <script src="/assets/bundle.js" />
    </body>
  </html>
);

Html.displayName = 'Html';

Html.propTypes = {
  language: PropTypes.string,
  markup: PropTypes.string.isRequired,
  state: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  title: PropTypes.string,
};

Html.defaultProps = {
  language: 'en',
  state: {},
  title: 'Universal Twitter React Application',
};

export default Html;
