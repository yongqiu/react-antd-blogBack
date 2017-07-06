import React from 'react'
import * as Service from '../services/getUserCountServer';
// introduce
export default class myIntroduce extends React.Component {
    constructor(props) {
        super(props)
    }
    requestServer(){
        let requestData = {
            headers: {
            },
        };
        Service.getUserCountByDay(requestData).then(function(result){
            console.log(result)
        }.bind(this));
    };
    componentDidMount() {
        this.requestServer();
    };
    render() {
        return (
            <div className="ani-box">
                首页
            </div>
        )
    }
}
