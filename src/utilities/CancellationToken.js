import CancellationTokenSource from './CancellationTokenSource';
import CancelError from './CancelError';
import CancellationState from '../constants/CancellationState';

/**
 * Propagates notifications that operations should be canceled.
 * @see https://github.com/tc39/proposal-cancellation/tree/master/stage0#class-cancellationtoken
 */
class CancellationToken {
  /**
   * Creates a new CancellationToken linked to an existing CancellationTokenSource.
   * @param {CancellationTokenSource} source
   */
  constructor(source) {
    /**
     * Gets a value indicating whether cancellation has been requested.
     * @property {Boolean}
     */
    Object.defineProperty(this, 'cancellationRequested', {
      get() {
        return source.cancellationRequested;
      },
    });

    /**
     * Gets a value indicating whether the underlying source can be canceled.
     * @property {Boolean}
     */
    Object.defineProperty(this, 'canBeCanceled', {
      get() {
        return source.canBeCanceled;
      },
    });

    /**
     * Throws a CancelError if cancellation has been requested.
     * @throws {CancelError}
     */
    this.throwIfCancellationRequested = () => {
      if (this.cancellationRequested) {
        throw new CancelError();
      }
    };

    /**
     * Registers a callback to execute when cancellation is requested.
     * @param {Function} The callback to register.
     * @returns {Object}
     */
    this.register = (callback) => {
      const registration = source.register(callback);
      return registration;
    };
  }
}

export default CancellationToken;

/**
 * Gets a token which will never be canceled.
 * @static
 * @property {CancellationToken}
 */
const closedSource = new CancellationTokenSource();
closedSource.close();
CancellationToken.none = closedSource;

/**
 * Gets a token that is already canceled.
 * @static
 * @property {CancellationToken}
 */
const canceledSource = new CancellationTokenSource();
canceledSource.cancel();
CancellationToken.canceled = new CancellationToken(CancellationState.REQUESTED);
