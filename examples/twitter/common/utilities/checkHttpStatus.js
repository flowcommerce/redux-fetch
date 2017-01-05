/**
 * A simple utility that rejects a request on any non 2XX response.
 */
export default function checkHttpStatus(response) {
  const { statusCode, statusText } = response;

  if (statusCode >= 200 && statusCode < 300) {
    return response;
  }

  const error = new Error(statusText);
  error.response = response;
  throw error;
}
