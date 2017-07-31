/**
 * Created by yongqiu on 2017/7/31.
 */
import React, {Component, PropTypes} from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import * as Service from '../../services/loginServer';
const FormItem = Form.Item;

class LoginForm extends React.Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            message : ''
        };
    }
    handleSubmit = (e) => {
        e.preventDefault();
        let _this = this
        this.props.form.validateFields((err, values) => {
            let {username, password, remember} = values
            if (!err) {
                let requireData = {
                    username: username,
                    password: password
                }
                Service.loginService(requireData).then(function (result) {
                    console.log(result)
                    let code = result.data.code
                    let message = result.data.message
                    if (code !== 0){
                        _this.setState({
                            message: message
                        })
                    }else{
                        _this.setState({
                            message: message
                        })
                        if(remember){
                            localStorage.username = username.toLowerCase();
                        }else {
                            sessionStorage.username = username.toLowerCase();
                        }
                        setTimeout(function () {
                            _this.context.router.push({ pathname: `/`})
                        },1000)
                    }
                })
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { message } = this.state
        return (
            <div className="loginBox">
                <img src="http://otsimngnj.bkt.clouddn.com/Ruby-Blog.png" alt="wyq"/>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
                        )}
                    </FormItem>
                    <p>{message}</p>
                    <FormItem>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(
                            <Checkbox>Remember me</Checkbox>
                        )}
                        Or <a href="">register now!</a>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                    </FormItem>
                </Form>
            </div>

        );
    }
}
LoginForm.contextTypes = {
    router: function contextType() {
        return React.PropTypes.Object;
    }
}
export default Form.create()(LoginForm)