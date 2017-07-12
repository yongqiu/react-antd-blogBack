/**
 * Created by Administrator on 2017/7/6.
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

export function addTagsService(requireData) {
    const requestURL = 'http://localhost:8888/admin/api/addArticleTags'
    let requestData = {
        method: 'POST',
        headers: { ...headers},
        body: JSON.stringify(requireData)
    };
    return request( requestURL , requestData );
}

export function getTagsService() {
    const requestURL = 'http://localhost:8888/admin/api/getArticleTags'
    let requestData = {
        method: 'GET',
        headers: { ...headers}
    };
    return request( requestURL , requestData );
}

export function addArticleService(requireData) {
    const requestURL = 'http://localhost:8888/admin/api/addArticle'
    let requestData = {
        method: 'POST',
        headers: { ...headers},
        body: JSON.stringify(requireData)
    };
    return request( requestURL , requestData );
}
