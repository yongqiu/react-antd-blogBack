/**
 * Created by Administrator on 2017/7/19.
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

export function getArticleService(requireData) {
    const requestURL = BASEURL+'/admin/api/getArticle'
    let requestData = {
        method: 'POST',
        headers: { ...headers},
        body: JSON.stringify(requireData)
    };
    return request( requestURL , requestData );
}

export function getArticleDetialService(requireData) {
    const requestURL = BASEURL+'/admin/api/getArticleDetail?id='+requireData.id
    let requestData = {
        method: 'GET',
        headers: { ...headers},
    };
    return request( requestURL , requestData );
}

export function deleteArticleService(requireData) {
    const requestURL = BASEURL+'/admin/api/deleteArticle?id='+requireData.id
    let requestData = {
        method: 'GET',
        headers: { ...headers},
    };
    return request( requestURL , requestData );
}

