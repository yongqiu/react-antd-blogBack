/**
 * Created by Administrator on 2017/7/21.
 */
import React, {Component, PropTypes} from 'react';
import { Menu, Icon } from 'antd';
import { Table, Popconfirm } from 'antd';
import * as Service from '../../services/getArticleServer';

class ArticleList extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            articleArray: [],
            totalCount: 0,
            loading: true
        }
        this.limit = 10
        this.columns = [{
            title: 'title',
            dataIndex: 'title',
            render: (text, record) => (
                <a href="javascript:;">{text}</a>
            ),
            onCellClick: (record, event) => {
                this.context.router.push({ pathname: `/articleDetail`, query:{id: record._id}})
            },
        }, {
            title: 'tags',
            dataIndex: 'tags',
            render: (text, record) =>{
                let tags = text.map(function(value, index) {
                    return <a href="#">{value}  </a>
                })
                return tags
            }
        }, {
            title: 'date',
            dataIndex: 'date',
        }, {
            title: 'Action',
            render: (text, record) => (
                <a href="javascript:;">Edit</a>
            ),
            onCellClick: (record, event) => {
                let queryData = {
                    id: record._id,
                    description:record.description,
                    title: record.title,
                    tags: record.tags
                }
                this.context.router.push({ pathname: `/articleEdit`, state:{...queryData}})
            },
        }, {
            title: 'Action',
            render: (text, record, index) => {
                return (
                    this.state.articleArray.length > 1 ?
                        (
                            <Popconfirm title="Sure to delete?" onConfirm={() => this.deleteArticle(record._id)}>
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
    handleTableChange(pagination, filters, sorter){
        let page = pagination.current
        this.requestServer(page)
        this.setState({
            currentPage: page
        })
    }
    requestServer = (page) =>{
        let _this = this
        let requireData = {
            page: page,
            limit: this.limit
        }
        Service.getArticleService(requireData).then(function (result) {
            let { ArticleList, totalCount } = result.data
            let datamap = [];
            for (let i = 0; i < ArticleList.length; i++) {
                datamap.push({
                    id: i+1,
                    title: ArticleList[i].title,
                    description: ArticleList[i].description,
                    date: ArticleList[i].date,
                    _id: ArticleList[i]._id,
                    tags: ArticleList[i].tags,
                })
            }
            _this.setState({
                articleArray : datamap,
                totalCount: totalCount,
                loading :false
            })
        })
    }
    deleteArticle = (id) =>{
        let requireData = {
            id: id
        }
        let _this = this
        let page = this.state.currentPage
        Service.deleteArticleService(requireData).then(function (result) {
            _this.requestServer(page)
        })
    }
    render() {
        return (
            <div className="articleTable">
                <Table
                    columns={this.columns}
                    dataSource={this.state.articleArray}
                    onChange={this.handleTableChange.bind(this)}
                    pagination={{ pageSize: this.limit , total: this.state.totalCount}}
                    loading={this.state.loading}
                />
            </div>
        )
    }
}
ArticleList.contextTypes = {
    router: function contextType() {
        return React.PropTypes.Object;
    }
}

export default ArticleList
