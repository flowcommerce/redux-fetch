/**
 * Returns whether the current runtime is the browser assuming these variables were not
 * intentionally created in other environments.
 * @return {Boolean}
 */
export default function isBrowser() {
  return (typeof window !== 'undefined') && (typeof document !== 'undefined');
}
