import React from 'react'
// introduce
class myIntroduce extends React.Component {
    constructor(props, context) {
        super(props, context)
    }
    componentDidMount() {
        let localCookie = localStorage.username
        let sessionCookie = sessionStorage.username
        console.log(sessionCookie)
        if (!localCookie && !sessionCookie){
            this.context.router.push({ pathname: `/login`})
            return
        }
    }
    render() {
        return (
            <div className="ani-box">
                首页
            </div>
        )
    }
}
myIntroduce.contextTypes = {
    router: function contextType() {
        return React.PropTypes.Object;
    }
}
export default myIntroduce
