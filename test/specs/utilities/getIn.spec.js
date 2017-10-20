import getIn from '../../../src/utilities/getIn';

describe('getIn', () => {
  it('should get string keyed property values', () => {
    const object = { a: 1 };
    expect(getIn(object, 'a')).to.equal(1);
    expect(getIn(object, ['a'])).to.equal(1);
  });

  it('should get deep property values', () => {
    const object = { a: { b: 2 } };
    expect(getIn(object, 'a.b')).to.equal(2);
    expect(getIn(object, ['a', 'b'])).to.equal(2);
  });

  it('should return `undefined` when `object` is nullish', () => {
    expect(getIn(null, 'constructor')).to.equal(undefined);
    expect(getIn(null, ['constructor'])).to.equal(undefined);
    expect(getIn(undefined, 'constructor')).to.equal(undefined);
    expect(getIn(undefined, ['constructor'])).to.equal(undefined);
  });

  it('should return `undefined` for deep paths when `object` is nullish', () => {
    expect(getIn(null, 'constructor.prototype.valueOf')).to.equal(undefined);
    expect(getIn(null, ['constructor', 'prototype', 'valueOf'])).to.equal(undefined);
    expect(getIn(undefined, 'constructor.prototype.valueOf')).to.equal(undefined);
    expect(getIn(undefined, ['constructor', 'prototype', 'valueOf'])).to.equal(undefined);
  });

  it('should return `undefined` if parts of `path` are missing', () => {
    const object = { a: {} };
    expect(getIn(object, 'a.b.c')).to.equal(undefined);
    expect(getIn(object, ['a', 'b', 'c'])).to.equal(undefined);
  });

  it('should be able to return `null` values', () => {
    const object = { a: { b: null } };
    expect(getIn(object, 'a.b')).to.equal(null);
    expect(getIn(object, ['a', 'b'])).to.equal(null);
  });

  it('should return the default value for `undefined` values', () => {
    const object = { a: {} };
    expect(getIn(object, 'a.b', 3)).to.equal(3);
    expect(getIn(object, ['a', 'b'], 3)).to.equal(3);
  });
});
