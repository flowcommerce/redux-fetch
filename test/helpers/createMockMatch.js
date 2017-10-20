const defaults = {
  params: {},
  isExact: false,
  path: '/somewhere',
  url: '/somewhere',
};

export default function createMockMatch(overrides) {
  return Object.assign({}, defaults, overrides);
}
