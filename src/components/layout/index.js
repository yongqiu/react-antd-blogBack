import React from 'react';
import { Router, Route, Link, hashHistory, IndexRoute, Redirect, IndexLink} from 'react-router';

// 引入Antd的导航组件
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;

let routeMap = {
    '/myIntroduce': '0',
    '/articleEdit': '1',
    '/articleTable': '2',
    '/userList': '3',
};// 配置导航
class Sider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: '',
            username: ''
        };
    }

    handleClick(e) {
        this.setState({
            current: e.key
        });
    }

    componentWillMount() {
        var route = this.props.location.pathname;   
        this.setState({
            current: routeMap[route] || '0'
        });
    }

    componentDidMount() {
        this.setState({
            username: 'wyq'
        });
    }

    render() {
        return (
            <div>
                <div className="header">
                    yongqiu Blog
                    {/*<Menu mode="horizontal">*/}
                        {/*/!*<SubMenu title={<span><Icon type="user" />{ this.state.username }</span>}>*!/*/}
                            {/*/!*<Menu.Item key="setting:1">退出</Menu.Item>*!/*/}
                        {/*/!*</SubMenu>*!/*/}
                    {/*</Menu>*/}
                </div>
                <div className="content">
                    <div id="leftMenu">
                        <img src={require('../../images/icon.jpg')} width="80" id="logo"/>
                        <Menu
                            onClick={this.handleClick.bind(this)}
                            style={{ width: 200 }}
                            defaultOpenKeys={['sub1', 'sub2']}
                            defaultSelectedKeys={[this.state.current]}
                            mode="inline"
                        >
                            <Menu.Item key="0"><Link to="/myIntroduce"><Icon type="mail" />Dashboard</Link></Menu.Item>
                            <SubMenu key="sub1" title={<span><Icon type="bars" /><span>CountCharts</span></span>}>
                                <Menu.Item key="1"><Link to="/articleEdit">新增文章</Link></Menu.Item>
                                <Menu.Item key="2">
                                    <Link to="articleTable">文章列表</Link>
                                </Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub2" title={<span><Icon type="bars" /><span>ListPage</span></span>}>
                                <Menu.Item key="3"><Link to="/userList">用户列表</Link></Menu.Item>
                            </SubMenu>
                        </Menu>
                    </div>
                    <div id="rightWrap">
                        <div className="right-box">
                            { this.props.children }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Sider;