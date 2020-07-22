import React from 'react';
import { Redirect } from 'react-router-dom';

import { LOG } from '../../utils'
import './welcome.css';
import '../../index.css'

class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            toResult: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.keyPressed = this.keyPressed.bind(this);
    }

    componentDidMount() {
        LOG('In welcome page')
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        if (this.state.value === '') {
            return;
        }
        event.preventDefault();
        this.setState({ toResult: true });
    }

    keyPressed(event) {
        if (event.key === 'Enter') {
            this.handleSubmit(event);
        }
    }

    render() {
        document.title = "Memegle";
        if (this.state.toResult) {
            const newRoute = '/search?keyword=' + this.state.value + '&page=0';
            document.title = this.state.value + " - Memegle";
            return <Redirect to={newRoute} />;
        }
        else {
            return (
                <div className='container'>
                    <div className='row home-header'>
                        <div className='row home-logo-div'>
                            <img src={require('../../assets/Memegle.png')} className='home-logo' alt='none'/>
                        </div>
                        <div className='row home-search-bar-div'>
                            <div className='col-9 center'>
                                <input className='home-search-bar' type='text' placeholder='热门关键词...'
    value={this.state.value} onKeyPress={this.keyPressed} onChange={this.handleChange}/>
                            </div>
                            <div className='center'>
                                <button className='button-search' onClick={this.handleSubmit}>搜图 :)</button>
                            </div>
                        </div>
                    </div>
                    <div className='row text center'>
                        网络表情符号最早来自于1982年美国卡内基梅隆大学Scott E·Fahlman教授在BBS上首次使用的ASCII码”:-)”表示微笑。
                    </div>
                </div>
            );
        }
    }
}

export default Welcome;
