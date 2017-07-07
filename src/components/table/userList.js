import React, {Component, PropTypes} from 'react';
import {Table, Icon} from 'antd';
import * as Service from '../../services/userListServer';
const columns = [{
        title: 'id',
        dataIndex: 'id',
        render: text => <a href="#">{text}</a>,
    }, {
        title: 'username',
        dataIndex: 'username',
        render: text => <a href="#">{text}</a>,
    }, {
        title: 'password',
        dataIndex: 'password',
    }, {
        title: 'isAdmin',
        dataIndex: 'isAdmin',
    }, {
        title: 'Action',
        render: (text, record) => (
            <span>
              <a href="javascript:;">Edit</a>
              <span className="ant-divider"/>
              <a href="javascript:;">Delete</a>
              <span className="ant-divider"/>
            </span>
        ),
        onCellClick: (record, event) => {
            console.log(record)
        },
}];
// const data = [];
// for (let i = 0; i < 46; i++) {
//     data.push({
//         id: i,
//         username: `Edward King ${i}`,
//         password: 32,
//         isAdmin: false,
//     });
// }

class UserList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userlist: [],
            loading: true,
            totalCount: 1,
        }
        this.pageLimit = 5
    }
    requestServer(page) {
        let reqData = {
            page: page,
            limit: this.pageLimit
        }
        Service.getUserList(reqData).then(function (result) {
            let data = result.data.data;
            let datamap = [];
            for (let i = 0; i < data.length; i++) {
                datamap.push({
                    id: i+1,
                    username: data[i].username,
                    password: data[i].password,
                    isAdmin: data[i].isAdmin ? '管理员' : '',
                })
            }
            this.setState({
                userlist: datamap,
                loading: false,
                totalCount: result.data.totalCount
            })
        }.bind(this));
    };
    handleTableChange(pagination, filters, sorter){
        let page = pagination.current
        this.requestServer(page)
    }

    componentDidMount() {
        this.requestServer(1)
    };

    render() {
        return (
            <Table
                columns={columns}
                dataSource={this.state.userlist}
                loading={this.state.loading}
                pagination={{ pageSize: this.pageLimit , total: this.state.totalCount}}
                onChange={this.handleTableChange.bind(this)}
            />
        );
    }
}

export default UserList;
