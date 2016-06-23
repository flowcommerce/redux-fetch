import { createStore, applyMiddleware, compose } from 'redux';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import reduxThunk from 'redux-thunk';
import reduxLogger from 'redux-logger';
import combinedReducers from '../reducers';

const middlewares = [
	reduxThunk,
	routerMiddleware(browserHistory),
];

if (process.env.RUNTIME === 'browser') {
	middlewares.push(reduxLogger({
		level: 'info',
		collapsed: true,
	}));
}

const enhancer = compose(
	applyMiddleware(...middlewares)
);

export default function configureStore(initialState = {}) {
  const store = createStore(combinedReducers, initialState, enhancer);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      store.replaceReducer(require('../reducers'));
    });
  }

  return store;
}
