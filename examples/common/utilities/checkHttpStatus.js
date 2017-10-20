import HttpStatusError from './HttpStatusError';

export default function checkHttpStatus(response) {
  if (response.status < 200 || response.status >= 300) {
    throw new HttpStatusError(response);
  } else {
    return response;
  }
}
