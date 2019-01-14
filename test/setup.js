import jsdom from 'jsdom';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import Enzyme from 'enzyme';
import React16EnzymeAdapter from 'enzyme-adapter-react-16';

// Because relying on package.json to set this environment is almost always OK, but when one user
// just throws mocha in his terminal we don't want to punish him with data loss or any other hell.
process.env.NODE_ENV = 'test';

// Expose Sinon to global scope.
global.sinon = sinon;

// Expose Chai assertion utilities to global scope.
// Remove comment on any other assertion utility you want to make globally
// accessible during your tests:
global.chai = chai;
global.expect = chai.expect;
// global.should = chai.should();
// global.AssertionError = chai.AssertionError;

// Setup Chai plugins
chai.use(sinonChai);
chai.use(chaiAsPromised);

// Setup JSDOM
const { window } = new jsdom.JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost', // required to fix SecurityError: https://github.com/jsdom/jsdom/issues/2383
});
global.window = window;

Object.keys(global.window).forEach((key) => {
  if (!(key in global)) {
    global[key] = global.window[key];
  }
});

Enzyme.configure({ adapter: new React16EnzymeAdapter() });

// Stub console.error() to throw an error when called.
// The intention is to catch prop type validation errors in React components.
sinon.stub(console, 'error').callsFake((message) => {
  throw new Error(message);
});
