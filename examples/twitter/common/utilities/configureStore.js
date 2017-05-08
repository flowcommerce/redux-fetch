import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import reduxThunk from 'redux-thunk';
import combinedReducers from '../reducers';

const middleware = [reduxThunk];

if (process.browser) {
  middleware.push(createLogger({ level: 'info', collapsed: true }));
}

export default function configureStore(initialState = {}) {
  const store = createStore(
    combinedReducers,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware)),
  );

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      // eslint-disable-next-line global-require
      store.replaceReducer(require('../reducers'));
    });
  }

  return store;
}
