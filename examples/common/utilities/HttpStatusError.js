export default function HttpStatusError(response) {
  const error = new Error('Response is outside 2xx range');
  error.name = 'HttpStatusError';
  error.response = response;
  return error;
}
