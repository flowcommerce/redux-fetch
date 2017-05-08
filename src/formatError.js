import isError from './isError';

export default function formatError(error) {
  if (!isError(error)) return error;
  return {
    message: error.message,
    name: error.name,
    stack: error.stack,
  };
}
