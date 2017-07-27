/**
 * Created by Administrator on 2017/7/19.
 */
import React, {Component, PropTypes} from 'react';
import { Button } from 'antd';
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
    componentDidMount(){
        let _this = this
        let id = this.props.location.query.id
        let requireData = {
            id: id
        }
        Service.getArticleDetialService(requireData).then(function (result) {
            let description = result.data.description
            let title = result.data.title
            let date = result.data.date
            let id = result.data._id
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
                date: date,
                id: id
            })
        })
    }
    render() {
        let { previewHtml, title, date, id } = this.state
        return (
            <div className="articleDetail">
                <div className="title">{title}</div>
                <div className="date">
                    {date? date : '2017-07-19'}
                </div>
                <div className="articleContent" dangerouslySetInnerHTML={{__html: previewHtml}}></div>
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