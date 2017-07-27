import React, {Component, PropTypes} from 'react';
import {Table,  Modal, Popconfirm, Form, Radio, Icon, Button, Input, notification } from 'antd';
import * as Service from '../../services/userListServer';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
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
            modalVisible: false,
            rowInfo:{
                username:'',
                isAdmin:'',
            },
            currentPage:1
        }
        this.pageLimit = 5;
        this.columns = [{
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
                <a href="javascript:;">Edit</a>
            ),
            onCellClick: (record, event) => {
                this.showModal(record)
            },
        }, {
            title: 'Action',
            render: (text, record, index) => {
                return (
                    this.state.userlist.length > 1 ?
                        (
                            <Popconfirm title="Sure to delete?" onConfirm={() => this.deleteUserInfo(record)}>
                                <a href="#">Delete</a>
                            </Popconfirm>
                        ) : null
                );
            },
        }];
    }
    componentDidMount() {
        this.requestServer(1)
    }
    /*
    * 获取userlist
    * */
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
                    _id: data[i]._id,
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
    /*
    * 点击分页
    * */
    handleTableChange(pagination, filters, sorter){
        let page = pagination.current
        this.requestServer(page)
        this.setState({
            currentPage:page,
            rowInfo:{
                username:'',
                isAdmin:'',
                _id: ''
            },
        })
    }
    /*
    * 修改用户信息
    * */
    handleSubmit = (e) => {
        e.preventDefault();
        let _this = this;
        let page = this.state.currentPage
        this.props.form.validateFields((err, values) => {
            if (!err) {
                Service.editUserInfo(values).then(function (response) {
                    if (response.data.code == 400){
                        _this.props.form.setFields({
                            username: {
                                value: values.username,
                                errors: [new Error('用户名已存在')],
                            },
                        });
                        notification.open({
                            message: '用户名已存在',
                            description: 'This is the content of the notification.notification.',
                            duration: 2
                        })
                        return
                    }else if (response.data.code == 200){
                        notification.open({
                            message: '修改成功',
                            description: 'This is the content of the notification.',
                            duration: 2
                        })
                        _this.handleCancel()
                        _this.requestServer(page)
                    }
                })
            }
        });
    }
    /*
    * 删除用户
    * */
    deleteUserInfo = (values) =>{
        let _this = this
        let page = this.state.currentPage
        Service.deleteUserInfo(values).then(function (response) {
            console.log(response)
            _this.requestServer(page)
        })
    }
    /*
    * 显示Modal
    * */
    showModal = (record) =>{
        this.setState({
            modalVisible: true,
        })
        this.props.form.setFieldsValue({
            username: record.username,
            isAdmin: record.isAdmin ? 'true' : 'false',
            _id: record._id
        });
    }
    /*
    * 关闭Modal
    * */
    handleCancel = (e) => {
        this.setState({
            modalVisible: false,
        });
    }
    render() {
        const columns = this.columns;
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Table
                    columns={columns}
                    dataSource={this.state.userlist}
                    loading={this.state.loading}
                    pagination={{ pageSize: this.pageLimit , total: this.state.totalCount}}
                    onChange={this.handleTableChange.bind(this)}
                />
                <Modal
                    title="Basic Modal"
                    visible={this.state.modalVisible}
                    onCancel={this.handleCancel.bind(this)}
                    footer={[
                        <Button key="back" size="large" onClick={this.handleCancel}>Return</Button>,
                        <Button key="submit" type="primary" size="large" onClick={this.handleSubmit}>
                            Submit
                        </Button>,
                    ]}
                >
                    <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
                        <FormItem>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: 'Please input username!' }],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ fontSize: 13 }} />}
                                    placeholder="Username"
                                />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('isAdmin')(
                                <RadioGroup>
                                    <Radio value="true">管理员</Radio>
                                    <Radio value="false">访客</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('_id')(
                                <Input placeholder="Username"/>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>

        );
    }
}

export default Form.create()(UserList);
