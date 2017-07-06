import fetch from 'isomorphic-fetch';
let headers = { 
  'Accept': 'application/json', 
  'Content-Type': 'application/json',
};

function parseJSON(response) {
    return response.json();
};

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
};

function request(url, options) {
    return fetch(url, options)
        .then(checkStatus)
        .then(parseJSON)
        .then((data) => ({ data }))
        .catch((err) => ({ err }));
};

export function getUserCountByDay() {
  const requestURL = 'http://localhost:8888/api/user/test'
  let requestData = {
    method: 'POST',
    headers: { ...headers}
  };
  return request( requestURL , requestData );
}
