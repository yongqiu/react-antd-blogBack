/**
 * Created by Administrator on 2017/7/11.
 */
import React from 'react'
import { Form, Tag, Input, Tooltip, Radio, Button, Select } from 'antd';
import * as Service from '../../services/addArticleServer';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
// introduce
class articleAdd extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tags: ['javascript'],
            inputVisible: false,
            inputValue: '',
            existArray:[]
        };
    }

    componentDidMount() {
        let _this = this
        Service.getTagsService().then(function (result) {
            console.log(result)
            _this.setState({
                existArray: result.data.tagArray
            })
        })
    };


    //关闭标签
    handleClose = (removedTag) => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        this.setState({ tags });
    }

    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus());
    }

    handleInputChange = (e) => {
        this.setState({ inputValue: e.target.value });
    }

    handleInputConfirm = (selectVal) => {
        let { inputValue, tags } = this.state
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }else {
            tags = [...tags, selectVal];
        }
        console.log(tags);
        this.setState({
            tags,
            inputVisible: false,
            inputValue: '',
        });
    }

    saveInputRef = input => this.input = input

    handleSelectChange = (value) => {
        this.handleInputConfirm(value)
    }
    handleSubmit = () => {
        const { tags } = this.state
        const { form } = this.props
        // Service.addTagsService(requireData).then(function (result) {
        //     console.log(result)
        // })
        form.validateFields((err,value) => {
            let requireData = {...value, tags}
            Service.addArticleService(requireData).then(function (result) {
                console.log(result)
            })
        })
    }
    render() {
        const { form } = this.props
        const { getFieldDecorator } = form;
        const { tags, inputVisible, inputValue, existArray } = this.state;
        let tagsList = existArray.map(function(value) {
            return <option value={value}>{value}</option>
        });
        return (
            <div className="articleAdd">
                <Form layout="vertical">
                    <FormItem label="Title">
                        {getFieldDecorator('title', {
                            rules: [{ required: true, message: 'Please input the title of collection!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="" className='tagItem'>
                        <div className='tagbox'>
                            {tags.map((tag, index) => {
                                const isLongTag = tag.length > 20;
                                const tagElem = (
                                    <Tag key={tag} closable={index !== -1} afterClose={() => this.handleClose(tag)}>
                                        {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                                    </Tag>
                                );
                                return isLongTag ? <Tooltip title={tag}>{tagElem}</Tooltip> : tagElem;
                            })}
                            {inputVisible && (
                                <Input
                                    ref={this.saveInputRef}
                                    type="text"
                                    size="small"
                                    style={{ width: 78 }}
                                    value={inputValue}
                                    onChange={this.handleInputChange}
                                    onBlur={this.handleInputConfirm}
                                    onPressEnter={this.handleInputConfirm}
                                />
                            )}
                            {!inputVisible && <Button size="small" type="dashed" onClick={this.showInput}>+ New Tag</Button>}
                        </div>
                    </FormItem>
                    <FormItem>
                        <Select
                            placeholder="Select a option and change input text above"
                            onChange={this.handleSelectChange}
                            value="点击选择标签"
                        >
                            {tagsList}
                        </Select>
                    </FormItem>
                    <FormItem label="Description">
                        {getFieldDecorator('description')(<Input type="textarea" rows={4} />)}
                    </FormItem>
                    <FormItem className="collection-create-form_last-form-item">
                        {getFieldDecorator('modifier', {
                            initialValue: 'public',
                        })(
                            <RadioGroup>
                                <Radio value="public">Public</Radio>
                                <Radio value="private">Private</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" className="login-form-button" onClick={this.handleSubmit}>
                            提交
                        </Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default Form.create()(articleAdd);