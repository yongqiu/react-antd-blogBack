/**
 * Created by yongqiu on 2017/7/11.
 */
import React from 'react'
import { Form, Tag, Input, Tooltip, Radio, Button, Select, notification, Breadcrumb } from 'antd';
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
    constructor(props, context) {
        super(props, context)
        this.state = {
            inputVisible: false,
            inputValue: '',
            existArray:[],
            title: '请输入标题',
            description : '',
            tags: ['javascript'],
            id:''
        };
    }

    componentDidMount() {
        let _this = this
        let { description } = this.state
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
        })

        if (this.props.location.state){
            this.getEditArticle()
            this.smde.value(this.props.location.state.description)
        }else {
            this.smde.value(description)
        }

        Service.getTagsService().then(function (result) {
            _this.setState({
                existArray: result.data.tagArray
            })
        })


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

    getEditArticle = () =>{
        let { id, description, title ,tags } = this.props.location.state
        this.setState({
            description: description,
            title: title,
            tags: tags,
            id: id
        })
    }

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

    //标签输入框确认
    handleInputConfirm = () => {
        let { inputValue, tags } = this.state
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }
        this.setState({
            tags,
            inputVisible: false,
            inputValue: '',
        });
    }

    saveInputRef = input => this.input = input

    //选择标签
    handleSelectChange = (value) => {
        let { tags } = this.state
        tags = [...tags, value];
        this.setState({
            tags
        });
    }
    /*
     * ------ END -------
     * */

    //提交表单
    handleSubmit = () => {
        const { tags, id } = this.state
        const { form } = this.props
        const smde = this.smde.value()
        const date = new Date().format('yyyy-MM-dd hh:mm:ss')
        form.validateFields((err,value) => {
            let requireData = {...value, tags, smde, date, id}
            let _this = this
            if (value.title == '请输入标题'){
                notification.open({
                    message: '请输入标题',
                    duration: 2
                })
                return
            }
            if(smde == ''){
                notification.open({
                    message: '文章不能为空',
                    duration: 2
                })
                return
            }
            if (value.title && smde){
                Service.addArticleService(requireData).then(function (result) {
                    console.log(requireData)
                    if (result.data.code == '0000'){
                        notification.open({
                            message: '添加成功',
                            duration: 2
                        })
                    }
                }).then(function () {
                    Service.addTagsService(requireData).then(function (result) {
                        _this.context.router.push({ pathname: `/articleTable`})
                    })
                })
            }

        })
    }
    render() {
        const { form } = this.props
        const { getFieldDecorator } = form;
        const { tags, inputVisible, inputValue, existArray, title } = this.state;
        let tagsList = existArray.map(function(value) {
            return <option value={value}>{value}</option>
        });
        return (
            <div className="articleAdd">
                {/*<Breadcrumb>*/}
                    {/*<Breadcrumb.Item>Home</Breadcrumb.Item>*/}
                    {/*<Breadcrumb.Item><a href="">Application Center</a></Breadcrumb.Item>*/}
                    {/*<Breadcrumb.Item><a href="">Application List</a></Breadcrumb.Item>*/}
                    {/*<Breadcrumb.Item>An Application</Breadcrumb.Item>*/}
                {/*</Breadcrumb>*/}
                <Form layout="vertical">
                    <FormItem className='titleItem'>
                        {getFieldDecorator('title', {
                            rules: [{ required: true, message: '标题不能为空' }],
                            initialValue: title,
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
                    <FormItem className='selectItem'>
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
                    <FormItem className="radioItem">
                        {getFieldDecorator('modifier', {
                            initialValue: 'public',
                        })(
                            <RadioGroup>
                                <Radio value="public">Public</Radio>
                                <Radio value="private">Private</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem className="buttonItem">
                        <Button type="primary" htmlType="submit" className="login-form-button" onClick={this.handleSubmit}>
                            提交
                        </Button>
                    </FormItem>
                </Form>


            </div>
        )
    }
}
articleAdd.contextTypes = {
    router: function contextType() {
        return React.PropTypes.Object;
    }
}

export default Form.create()(articleAdd);