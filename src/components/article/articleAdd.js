/**
 * Created by Administrator on 2017/7/11.
 */
import React from 'react'
import { Form, Tag, Input, Tooltip, Radio, Button, Select, notification } from 'antd';
import * as Service from '../../services/addArticleServer';
import SimpleMDE from 'simplemde'
import marked from 'marked';
import highlight from 'highlight.js'
import '../../styles/simplemde.min.css';
import '../../styles/atom-one-dark.css';

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
            existArray:[],
            content: ''
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

        //new SimpleMDE 富文本编辑器
        this.smde = new SimpleMDE({
            element: document.getElementById('editor').childElementCount,
            autofocus: true,
            autosave: true,
            previewRender: function(plainText) {
                return marked(plainText,{
                    renderer: new marked.Renderer(),
                    gfm: true,
                    pedantic: false,
                    sanitize: false,
                    tables: true,
                    breaks: true,
                    smartLists: true,
                    smartypants: true,
                    highlight: function (code) {
                        return highlight.highlightAuto(code).value;
                    }
                });
            },
        });
        this.smde.value("快来开始写博客吧")

        // 定义Data格式
        // 用法new Date().format('yyyy-MM-dd hh:mm:ss')
        Date.prototype.format = function(format) {
            var o = {
                "M+": this.getMonth() + 1, //month
                "d+": this.getDate(), //day
                "h+": this.getHours(), //hour
                "m+": this.getMinutes(), //minute
                "s+": this.getSeconds(), //second
                "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
                "S": this.getMilliseconds() //millisecond
            }
            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1,(this.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o){
                if (new RegExp("(" + k + ")").test(format)){
                    format = format.replace(RegExp.$1,RegExp.$1.length == 1 ? o[k] :("00" + o[k]).substr(("" + o[k]).length));
                }
            }
            return format;
        }

    };

    /*
    * 标签相关方法
    * */
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
    /*
     * ------ END -------
     * */

    //提交表单
    handleSubmit = () => {
        const { tags } = this.state
        const { form } = this.props
        const smde = this.smde.value()
        const date = new Date().format('yyyy-MM-dd hh:mm:ss')

        form.validateFields((err,value) => {
            let requireData = {...value, tags, smde, date}
            console.log(requireData)
            if (value.title && smde){
                Service.addArticleService(requireData).then(function (result) {
                    if (result.data.code == '0000'){
                        notification.open({
                            message: '添加成功',
                            duration: 2
                        })
                        Service.addTagsService(requireData).then(function (result) {
                            console.log(result)
                        })
                    }
                })
            }

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
                            rules: [{ required: true, message: '标题不能为空' }],
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
                    <FormItem>
                        <textarea id="editor">hello</textarea>
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