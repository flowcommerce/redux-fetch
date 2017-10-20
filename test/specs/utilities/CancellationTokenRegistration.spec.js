import CancellationTokenSource from '../../../src/utilities/CancellationTokenSource';
import CancellationToken from '../../../src/utilities/CancellationToken';

describe('CancellationTokenSource', () => {
  it('should create a cancellation token when instantiated', () => {
    const source = new CancellationTokenSource();
    expect(source.token).is.instanceof(CancellationToken);
  });

  it('should not have requested cancellation when instantiated', () => {
    const source = new CancellationTokenSource();
    expect(source.token.cancellationRequested).to.equal(false);
  });

  it('should be cancelable when instantiated', () => {
    const source = new CancellationTokenSource();
    expect(source.token.canBeCanceled).to.equal(true);
  });

  it('should have requested cancellation when cancel is called', () => {
    const source = new CancellationTokenSource();
    source.cancel();
    expect(source.token.cancellationRequested).to.equal(true);
  });

  it('should remain cancelable when cancel is called', () => {
    const source = new CancellationTokenSource();
    source.cancel();
    expect(source.token.canBeCanceled).to.equal(true);
  });

  it('should not have requested cancellation when close is called', () => {
    const source = new CancellationTokenSource();
    source.close();
    expect(source.token.cancellationRequested).to.equal(false);
  });

  it('should not be cancelable when close is called', () => {
    const source = new CancellationTokenSource();
    source.close();
    expect(source.token.canBeCanceled).to.equal(false);
  });

  it('should throw when registered callback is not a function', () => {
    const source = new CancellationTokenSource();
    expect(() => {
      source.token.register();
    }).to.throw;
  });

  it('should invoke registered callback when canceled', () => {
    const source = new CancellationTokenSource();
    const callback = sinon.stub();
    source.token.register(callback);
    source.cancel();
    expect(callback).to.have.been.calledOnce;
  });

  it('should not invoke unregistered callback when canceled', () => {
    const source = new CancellationTokenSource();
    const callback = sinon.stub();
    const registration = source.token.register(callback);
    registration.unregister();
    source.cancel();
    expect(callback).to.not.have.been.called;
  });

  it('should not invoke registered callback when cancellation is requested after it is closed', () => {
    const source = new CancellationTokenSource();
    const callback = sinon.stub();
    source.token.register(callback);
    source.close();
    source.cancel();
    expect(callback).to.not.have.been.called;
  });

  it('should immediately invoke callbacks registered after cancellation was requested', () => {
    const source = new CancellationTokenSource();
    const callback = sinon.stub();
    source.cancel();
    source.token.register(callback);
    expect(callback).to.have.been.calledOnce;
  });

  it('should not register callbacks after cancellation was requested', () => {
    const source = new CancellationTokenSource();
    const callback = sinon.stub();
    source.cancel();
    source.token.register(callback);
    expect(source.tokenRegistrations).to.be.undefined;
  });

  it('should not invoke callback registered after it is closed', () => {
    const source = new CancellationTokenSource();
    const callback = sinon.stub();
    source.close();
    source.token.register(callback);
    expect(callback).to.not.have.been.called;
  });

  it('should not accept callback registrations after it is closed', () => {
    const source = new CancellationTokenSource();
    const callback = sinon.stub();
    source.cancel();
    source.token.register(callback);
    expect(source.tokenRegistrations).to.be.undefined;
  });

  it('should have requested cancellation when linked token is canceled', () => {
    const source = new CancellationTokenSource();
    const linkedSource = new CancellationTokenSource([source.token]);
    source.cancel();
    expect(linkedSource.token.cancellationRequested).to.equal(true);
  });

  it('should remain cancelable when linked token is canceled', () => {
    const source = new CancellationTokenSource();
    const linkedSource = new CancellationTokenSource([source.token]);
    source.cancel();
    expect(linkedSource.token.canBeCanceled).to.equal(true);
  });
});
