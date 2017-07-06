import React, { Component, PropTypes } from 'react';
// 引入提示框和标题组件
import * as Service from '../../services/getUserCountServer';

//定义props
let defaultProps = {
    className:'Echartsaaa',
}


class UserCountByDay extends Component {
    static propTypes = {
        className: PropTypes.string,
    };
    constructor(props) {
        super(props);
        this.state= {
            androidData :{},
            myDate:[],
            countDay:7
        }
    };
    requestServer(){
        Service.getUserCountByDay().then(function(result){
          console.log(result)
        }.bind(this));
    };
    componentDidMount() {
        this.requestServer();
    };

    render() {
        return (
            <div>
              <h1>hello world</h1>
            </div>
            
        );
    }
}

UserCountByDay.defaultProps = defaultProps;
export default UserCountByDay;