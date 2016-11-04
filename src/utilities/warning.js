/* eslint-disable no-console */

const hasConsole = typeof console !== 'undefined' && typeof console.warn === 'function';

/**
 * Similar to invariant, but logs a warning while in development instead of throwing an error.
 * NOTE: We could turn this into a npm module and use it internally
 */
export default function warning(condition, format, ...args) {
  if (process.env.NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('`warning` requires an error message argument');
    }

    if (!condition && hasConsole) {
      let argIndex = 0;
      console.warn(`Warning: ${format.replace(/%s/g, () => {
        argIndex += 1;
        return args[argIndex];
      })}`);
    }
  }
}
