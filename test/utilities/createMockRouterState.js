const defaults = {
  location: {
    pathname: 'search/cats',
    search: '?unlimited',
    action: 'PUSH',
  },
  routes: [],
  params: {},
  components: [],
};

export default function createMockRouterState(state) {
  return Object.assign({}, defaults, state);
}
