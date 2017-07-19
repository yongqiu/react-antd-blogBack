'use strict';
import ReactDom from 'react-dom';
import React from 'react';
import { Router, Route, hashHistory, IndexRoute, Redirect, IndexLink} from 'react-router';
// 引入单个页面（包括嵌套的子页面）
import myIntroduce from './dashboard/introduce';
import userlist from './table/userList';
import articleAdd from './article/articleAdd';
import Sider from './layout/sider';
import articleDetial from './articleDetail'




// 配置路由
ReactDom.render((
    <Router history={hashHistory} >
        <Route path="/" component={Sider}>
            <IndexRoute component={myIntroduce} />
            <Route path="/myIntroduce" component={myIntroduce} />
            <Route path="/table/userList" component={userlist} />
            <Route path="/article/add" component={articleAdd} />
            <Route path="/articleDetial" component={articleDetial} />
        </Route>
    </Router>
), document.getElementById('app'));
