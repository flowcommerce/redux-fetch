import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';
import isBrowser from '../utilities/isBrowser';

const loggerMiddleware = createLogger({ level: 'info', collapsed: true });

export default function configureStore(initialState = {}) {
  const middlewares = [thunkMiddleware];

  if (isBrowser) {
    middlewares.push(loggerMiddleware);
  }

  const store = createStore(rootReducer, initialState, composeWithDevTools(
    applyMiddleware(...middlewares),
  ));

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      // eslint-disable-next-line global-require
      store.replaceReducer(require('../reducers'));
    });
  }

  return store;
}
