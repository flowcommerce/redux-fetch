import createMockLocation from './createMockLocation';

const defaultLocation = createMockLocation();

const defaults = {
  length: 1,
  action: 'POP',
  location: defaultLocation,
  index: 0,
  entries: [defaultLocation.pathname],
  createHref: sinon.stub(),
  push: sinon.stub(),
  replace: sinon.stub(),
  go: sinon.stub(),
  goBack: sinon.stub(),
  goForward: sinon.stub(),
  canGo: sinon.stub(),
  block: sinon.stub(),
  listen: sinon.stub(),
};

export default function createMockHistory(overrides) {
  return Object.assign({}, defaults, overrides);
}
