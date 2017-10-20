// JSON Placeholder API
// https://jsonplaceholder.typicode.com/

import fetch from 'isomorphic-fetch';
import checkHttpStatus from '../utilities/checkHttpStatus';
import parseJson from '../utilities/parseJson';

function removeLeadingSlash(string) {
  return string.startsWith('/') ? string.substring(1) : string;
}

function withBaseUrl(pathname) {
  const baseUrl = 'https://jsonplaceholder.typicode.com';
  return `${baseUrl}/${removeLeadingSlash(pathname)}`;
}

function makeRequest(pathname) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        accept: 'application/json',
      },
    };

    fetch(withBaseUrl(pathname), options)
      .then(checkHttpStatus)
      .then(parseJson)
      .then((response) => {
        resolve(response.json);
      })
      .catch((error) => {
        if (error.name === 'HttpStatusError') {
          reject(error.response);
        } else {
          reject(error);
        }
      });
  });
}

export function getPosts() {
  return makeRequest('/posts');
}

export function getPostById(postId) {
  return makeRequest(`/posts/${postId}`);
}

export function getComments() {
  return makeRequest('/comments');
}

export function getAlbums() {
  return makeRequest('/albums');
}

export function getPhotos() {
  return makeRequest('/photos');
}

export function getTodos() {
  return makeRequest('/todos');
}

export function getUsers() {
  return makeRequest('/users');
}
