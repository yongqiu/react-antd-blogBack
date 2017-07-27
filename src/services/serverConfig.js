const NODE_ENV = process.env.NODE_ENV
const __DEV__ = NODE_ENV === 'development'
const _PRODUCT_ = NODE_ENV === 'production'

'use strict';
let BASEURL;
if (__DEV__){
    BASEURL = "http://www.wuyongqiu.com"
}else if (_PRODUCT_){
    BASEURL = "http://www.wuyongqiu.com"
}

export default BASEURL