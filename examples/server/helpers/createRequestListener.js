import express from 'express';
import morgan from 'morgan';
import controllers from '../controllers';

export default function createRequestListener(webpackDevMiddleware, webpackHotMiddleware) {
  const app = express();
  app.use(morgan('tiny'));
  app.use(webpackDevMiddleware);
  app.use(webpackHotMiddleware);
  app.use(controllers);
  return app;
}
