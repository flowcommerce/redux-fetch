const defaults = {
  key: 'ac3df4',
  pathname: '/somewhere',
  search: '',
  hash: '',
  query: {},
  state: {},
};

export default function createMockLocation(overrides) {
  const location = Object.assign({}, defaults, overrides);
  return Object.freeze(location);
}
