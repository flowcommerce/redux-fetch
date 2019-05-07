import isError from './isError';

export default function formatError(error) {
  if (!isError(error)) return error;
  return {
    message: error.message,
    response: error.response,
    name: error.name,
    stack: error.stack,
  };
}
