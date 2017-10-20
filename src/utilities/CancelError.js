const defaultMessage = 'An asynchronous operation has been canceled';

export default class CancelError extends Error {
  constructor(message = defaultMessage) {
    super();
    this.message = message;
    this.name = 'CancelError';
  }
}
