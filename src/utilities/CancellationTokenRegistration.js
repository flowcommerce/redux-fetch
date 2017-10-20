class CancellationTokenRegistration {
  /**
   * Creates an object used to unregister a callback registered to a
   * CancellationToken.
   * @param {Function} callback
   * @param {CancellationTokenSource} source
   */
  constructor(callback, source) {
    this.callback = callback;
    this.unregister = () => {
      if (source !== undefined) {
        if (source.tokenRegistrations !== undefined) {
          const index = source.tokenRegistrations.indexOf(this);
          if (index > -1) {
            source.tokenRegistrations.splice(index, 1);
          }
        }
      }
    };
  }
}

export default CancellationTokenRegistration;
