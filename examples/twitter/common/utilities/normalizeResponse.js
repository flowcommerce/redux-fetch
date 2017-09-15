import parseJson from './parseJson';

export default function normalizeResponse(response) {
  return new Promise((resolve, reject) => {
    response.text()
      .then(parseJson)
      .then((json) => {
        resolve({
          ok: response.ok,
          data: json,
          statusCode: response.status,
          statusText: response.statusText,
        });
      }).catch((error) => {
        reject(error);
      });
  });
}
