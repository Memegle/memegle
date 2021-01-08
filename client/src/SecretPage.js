import React, {Component} from 'react';
import { render } from 'react-dom';
import { LOG } from 'utils';
import { performCount } from '../../actions/SecretPage';

export class SecretPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            count:"",
        };
    }
}

componentDidMount(){
    LOG("Secret Page");
    this.retrieveCount();
}

retrieveCount = () =>{
    performCount().then(res=>{
        this.setState({count:res})
    }).catch(error => LOG(error.message))
}

render(){
    return(
        <div>
            <h1>恭喜！你找到彩蛋了</h1>
            <h1>Memegle 有{this.state.count}个表情</h1>
        </div>
    )
}