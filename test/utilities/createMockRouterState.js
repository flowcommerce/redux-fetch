import defaultsDeep from 'lodash/defaultsDeep';

const defaults = {
  location: {
    pathname: 'search/cats',
    search: '',
    hash: '',
    action: 'PUSH',
    query: {},
  },
  routes: [],
  params: {},
  components: [],
};

const createMockRouterState = state => defaultsDeep(state, defaults);

export default createMockRouterState;
