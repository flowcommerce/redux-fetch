import CancellationToken from './CancellationToken';
import CancellationState from '../constants/CancellationState';
import CancellationTokenRegistration from './CancellationTokenRegistration';

/**
 * Signals a CancellationToken that it should be canceled.
 */
class CancellationTokenSource {
  /**
   * Initializes a new instance of a CancellationTokenSource.
   *
   * By supplying a set of linked tokens, you can model a complex cancellation graph that allows you
   * to signal cancellation to various subsets of a more complex asynchronous operation.
   * For example, you can create a cancellation hierarchy where a root CancellationTokenSource can
   * be used to signal cancellation for all asynchronous operations (such as when signing out of
   * an application), with linked CancellationTokenSource children used to signal cancellation for
   * subsets such as fetching pages of asynchronous data or stopping long-running background
   * operations in a Web Worker. You can also create a CancellationTokenSource that is attached to
   * multiple existing tokens, allowing you to aggregate multiple cancellation signals into
   * a single token.
   *
   * @param {Array} linkedTokens - An optional iterable of tokens to which to link this source.
   */
  constructor(linkedTokens) {
    this.state = CancellationState.OPEN;
    this.token = new CancellationToken(this);
    this.tokenRegistrations = undefined;
    this.linkedTokenRegistrations = undefined;
    this.registerLinkedTokens(linkedTokens);
  }

  /**
   * Gets a value indicating whether cancellation has been requested.
   * @public
   * @returns {Boolean}
   */
  get cancellationRequested() {
    return this.state === CancellationState.REQUESTED;
  }

  /**
   * Gets a value indicating whether the source can be canceled.
   * @public
   * @returns {Boolean}
   */
  get canBeCanceled() {
    return this.state !== CancellationState.CLOSED;
  }

  /**
   * Links the source with the specified tokens.
   * @private
   * @param {CancellationToken[]} linkedTokens
   */
  registerLinkedTokens(linkedTokens) {
    if (linkedTokens !== undefined) {
      linkedTokens.some((linkedToken) => {
        if (!(linkedToken instanceof CancellationToken)) {
          throw new TypeError('linkedToken is not an instance of CancellationToken');
        }

        if (linkedToken.cancellationRequested) {
          this.state = CancellationState.REQUESTED;
          this.unregisterLinkedTokens();
          return true;
        }

        if (linkedToken.canBeCanceled) {
          if (this.linkedTokenRegistrations === undefined) {
            this.linkedTokenRegistrations = [];
          }

          this.linkedTokenRegistrations.push(linkedToken.register(() => {
            this.cancel();
          }));
        }

        return false;
      });
    }
  }

  /**
   * Unlinks the source from any linked tokens.
   * @private
   */
  unregisterLinkedTokens() {
    const registrations = this.linkedTokenRegistrations;
    this.linkedTokenRegistrations = undefined;
    if (registrations !== undefined) {
      registrations.forEach((registration) => {
        registration.unregister();
      });
    }
  }

  /**
   * Cancels the source, evaluating any registered callbacks. If any callback
   * raises an exception, the exception is propagated to a host specific
   * unhandled exception mechanism.
   */
  cancel() {
    if (this.state === CancellationState.OPEN) {
      this.state = CancellationState.REQUESTED;
      this.unregisterLinkedTokens();
      const registrations = this.tokenRegistrations;
      this.tokenRegistrations = undefined;
      if (registrations !== undefined) {
        registrations.forEach((registration) => {
          registration.callback();
        });
      }
    }
  }

  /**
   * Closes the source, preventing the possibility of future cancellation.
   * If the source is linked to any existing tokens, the links are unregistered.
   */
  close() {
    if (this.state === CancellationState.OPEN) {
      this.state = CancellationState.CLOSED;
      this.unregisterLinkedTokens();
      const registrations = this.tokenRegistrations;
      this.tokenRegistrations = undefined;
      if (registrations !== undefined) {
        registrations.forEach((registration) => {
          registration.unregister();
        });
      }
    }
  }

  /**
   * Registers a callback to execute when cancellation has been requested.
   * If cancellation has already been requested, the callback is executed immediately.
   * @param {Function} callback - The callback to register.
   * @throws {TypeError} callback must be a function
   * @returns {CancellationTokenRegistration}
   */
  register(callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('callback is not a function');
    }

    if (this.state === CancellationState.REQUESTED) {
      callback();
    }

    if (this.state !== CancellationState.OPEN) {
      return new CancellationTokenRegistration(callback);
    }

    if (this.tokenRegistrations === undefined) {
      this.tokenRegistrations = [];
    }

    const registration = new CancellationTokenRegistration(callback, this);
    this.tokenRegistrations.push(registration);
    return registration;
  }
}


export default CancellationTokenSource;
