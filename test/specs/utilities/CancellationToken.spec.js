import CancellationToken from '../../../src/utilities/CancellationToken';
import CancellationTokenSource from '../../../src/utilities/CancellationTokenSource';

describe('CancellationToken', () => {
  it('throwIfCancellationRequested should throw when source is not canceled', () => {
    const source = new CancellationTokenSource();
    expect(() => {
      source.token.throwIfCancellationRequested();
    }).to.not.throw;
  });

  it('throwIfCancellationRequested should throw when source is canceled', () => {
    const source = new CancellationTokenSource();
    source.cancel();
    expect(() => {
      source.token.throwIfCancellationRequested();
    }).to.throw;
  });

  it('none is a static property referencing a cancellation token that cannot be canceled', () => {
    const token = CancellationToken.none;
    expect(token.canBeCanceled).to.equal(false);
    expect(token.cancellationRequested).to.equal(false);
  });
});
