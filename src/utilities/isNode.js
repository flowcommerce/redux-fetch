/**
 * Returns whether the current runtime is Node.js assuming these variables were not intentionally
 * created in other environments.
 * @return {Boolean}
 */
export default function isNode() {
  return (typeof window === 'undefined') && (typeof process !== 'undefined');
}
