import PropTypes from 'prop-types';
import React from 'react';
import safeStringify from '../../utilities/safeStringify';

const Html = ({
  bodyScripts,
  content,
  headLinks,
  language,
  preloadedState,
  title,
}) => (
  <html lang={language}>
    <head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      {headLinks.map(pathname => (<link key={pathname} rel="stylesheet" href={pathname} />))}
    </head>
    <body>
      <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
      <script id="preload" type="application/json" dangerouslySetInnerHTML={{ __html: safeStringify(preloadedState) }} />
      {bodyScripts.map(pathname => (<script key={pathname} src={pathname} />))}
    </body>
  </html>
);

Html.displayName = 'Html';

Html.propTypes = {
  bodyScripts: PropTypes.arrayOf(PropTypes.string),
  content: PropTypes.string,
  headLinks: PropTypes.arrayOf(PropTypes.string),
  language: PropTypes.string,
  preloadedState: PropTypes.object,
  title: PropTypes.string,
};

Html.defaultProps = {
  bodyScripts: [],
  content: '',
  headLinks: [],
  language: 'en',
  preloadedState: {},
  title: 'Redux Fetch',
};

export default Html;
