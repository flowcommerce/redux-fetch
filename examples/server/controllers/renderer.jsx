import { Router } from 'express';
import { fetchDataForRoutes } from '@flowio/redux-fetch';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import React from 'react';

import Html from '../../common/components/Html';
import InternalServerError from '../../common/components/InternalServerError';
import Root from '../../common/components/Root';
import configureRoutes from '../../common/utilities/configureRoutes';
import configureStore from '../../common/utilities/configureStore';

const router = new Router();

const normalizeAssets = assets => (Array.isArray(assets) ? assets : [assets]);
const addLeadingSlash = filepath => (filepath.startsWith('/') ? filepath : `/${filepath}`);
const withDoctype = executor => props => `<!DOCTYPE html>${executor(props)}`;
const renderPage = withDoctype(props => renderToStaticMarkup(<Html {...props} />));

router.use((req, res) => {
  const location = req.url;
  const store = configureStore();
  const routes = configureRoutes();
  store.dispatch(fetchDataForRoutes(routes, location)).then(() => {
    const context = {};
    const { assetsByChunkName } = res.locals.webpackStats.toJson();
    const assets = normalizeAssets(assetsByChunkName.main);
    const headLinks = assets.filter(pathname => pathname.endsWith('css')).map(addLeadingSlash);
    const bodyScripts = assets.filter(pathname => pathname.endsWith('js')).map(addLeadingSlash);
    const preloadedState = store.getState();
    const content = renderToString(
      <Root context={context} location={location} routes={routes} store={store} />,
    );
    res.type('html').send(renderPage({ bodyScripts, content, headLinks, preloadedState }));
  }).catch((error) => {
    const content = renderToStaticMarkup(<InternalServerError message={error.message} />);
    res.type('html').send(renderPage({ content }));
  });
});

export default router;
