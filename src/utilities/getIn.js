export default function getIn(object, path, defaultValue) {
  const [head, ...tail] = Array.isArray(path) ? path : path.split('.');
  const value = object == null ? undefined : object[head];
  if (value && tail.length > 0) {
    return getIn(value, tail, defaultValue);
  }
  return (typeof value === 'undefined') ? defaultValue : value;
}
