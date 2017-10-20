export default function parseJson(response) {
  return new Promise((resolve, reject) => {
    const { ok, status, statusText } = response;
    response.json().then((json) => {
      resolve({ json, ok, status, statusText });
    }).catch((error) => {
      reject(error);
    });
  });
}
