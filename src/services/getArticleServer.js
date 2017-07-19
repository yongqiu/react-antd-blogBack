/**
 * Created by Administrator on 2017/7/19.
 */
import fetch from 'isomorphic-fetch';
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

export function getArticleService() {
    const requestURL = 'http://localhost:8888/admin/api/getArticle'
    let requestData = {
        method: 'GET',
        headers: { ...headers}
    };
    return request( requestURL , requestData );
}

export function getArticleDetialService(requireData) {
    const requestURL = 'http://localhost:8888/admin/api/getArticleDetail?id='+requireData.id
    let requestData = {
        method: 'GET',
        headers: { ...headers},
    };
    return request( requestURL , requestData );
}

