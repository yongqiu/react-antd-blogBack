const NODE_ENV = process.env.NODE_ENV
const __DEV__ = NODE_ENV === 'development'
const _PRODUCT_ = NODE_ENV === 'production'

'use strict';
let BASEURL;
// BASEURL = "http://localhost:7777"
BASEURL = "http://39.108.13.1:8888"
// console.log(NODE_ENV)
// if (__DEV__){
//     BASEURL = "http://localhost:7777"
// }else if (_PRODUCT_){
//     BASEURL = "http://39.108.13.1:8888"
// }

export default BASEURL