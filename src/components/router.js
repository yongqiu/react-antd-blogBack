'use strict';
import ReactDom from 'react-dom';
import React from 'react';
import { Router, Route, hashHistory, IndexRoute, Redirect, IndexLink} from 'react-router';
// 引入单个页面（包括嵌套的子页面）
import myIntroduce from './introduce.js';
import Userlist from './table/userList.js';
import Sider from './sider.js';




// 配置路由
ReactDom.render((
    <Router history={hashHistory} >
        <Route path="/" component={Sider}>
            <IndexRoute component={myIntroduce} />
            <Route path="/myIntroduce" component={myIntroduce} />
            <Route path="/table/userList" component={Userlist} />
        </Route>
    </Router>
), document.getElementById('app'));
