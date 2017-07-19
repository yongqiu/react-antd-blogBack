/**
 * Created by Administrator on 2017/7/19.
 */
import React, {Component, PropTypes} from 'react';
import { Menu, Icon } from 'antd';
import * as Service from '../../services/getArticleServer';
import marked from 'marked';
import highlight from 'highlight.js'

class ChildSider extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            articleArray:[],
            previewHtml: '',
            title: '',
            date: ''
        }
    }
    componentDidMount() {
        let _this = this
        Service.getArticleService().then(function (result) {
            _this.setState({
                articleArray : result.data.ArticleList
            })
        }).then(function () {
            _this.getArticleDetial(0)
        })
    }
    handleClick = (e) => {
        let index = e.key
        this.getArticleDetial(index)
    }
    getArticleDetial = (index) =>{
        let { articleArray } = this.state
        let id = articleArray[index]._id
        let requireData = {
            id: id
        }
        let _this = this
        Service.getArticleDetialService(requireData).then(function (result) {
            let description = result.data.description
            let title = result.data.title
            let date = result.data.date
            let  markedArticle = marked(description, {
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
            })
            _this.setState({
                previewHtml: markedArticle,
                title: title,
                date: date
            })
        })
    }
    render() {
        let { articleArray, title, date } = this.state
        console.log(date)
        let articleList = articleArray.map(function(value, index) {
            return <Menu.Item key={index}>
                        <p>{value.title}</p>
                        <p>{value.date ? value.date:'2017-07-19'}</p>
                    </Menu.Item>
        });
        return (
            <div className="articleDetail">
                <div className="leftChildMenu">
                    <Menu
                        onClick={this.handleClick}
                        style={{ width: 240 }}
                        defaultSelectedKeys={['0']}
                        defaultOpenKeys={['sub1']}
                        mode="inline"
                    >
                        {articleList}
                    </Menu>
                </div>
                <div className="rightChildMenu">
                    <div className="title">{title}</div>
                    <div className="date">{date? date : '2017-07-19'}</div>
                    <div className="articleContent" dangerouslySetInnerHTML={{__html: this.state.previewHtml}}></div>
                </div>
            </div>

        )
    }
}
ChildSider.contextTypes = {
    router: function contextType() {
        return React.PropTypes.Object;
    }
}

export default ChildSider