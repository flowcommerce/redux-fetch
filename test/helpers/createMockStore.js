import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];

const createMockStore = configureStore(middlewares);

export default createMockStore;
