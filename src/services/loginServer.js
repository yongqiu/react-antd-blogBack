/**
 * Created by yongqiu on 2017/7/31.
 */
import fetch from 'isomorphic-fetch';
import BASEURL from './serverConfig';
let headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};
let body = {

}

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

export function loginService(requireData) {
    const requestURL = BASEURL+'/admin/api/login'
    let requestData = {
        method: 'POST',
        headers: { ...headers},
        body: JSON.stringify(requireData)
    };
    return request( requestURL , requestData );
}

