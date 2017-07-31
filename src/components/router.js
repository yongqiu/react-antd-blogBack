'use strict';
import ReactDom from 'react-dom';
import React from 'react';
import { Router, Route, browserHistory, IndexRoute, Redirect, IndexLink} from 'react-router';
// 引入单个页面（包括嵌套的子页面）
import myIntroduce from './dashboard/introduce';
import userlist from './table/userList';
import articleTable from './table/articleTable';
import articleEdit from './articleEdit';
import Sider from './layout';
import articleDetail from './articleDetail'
import loginForm from './login/login'


// 配置路由
ReactDom.render((
    <Router history={browserHistory} >
        <Route path="/login" component={loginForm} />
        <Route path="/" component={Sider}>
            <IndexRoute component={myIntroduce} />
            <Route path="/myIntroduce" component={myIntroduce} />
            <Route path="/userList" component={userlist} />
            <Route path="/articleEdit" component={articleEdit} />
            <Route path="/articleTable" component={articleTable} />
            <Route path="/articleDetail" component={articleDetail} />
        </Route>
    </Router>
), document.getElementById('app'));
