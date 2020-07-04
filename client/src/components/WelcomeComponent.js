import React from 'react';
import { Redirect } from 'react-router-dom';
import '../css/welcome.css';

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

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        if (this.state.value === '') {
            return;
        }
        event.preventDefault();
        console.log(this.state.value);
        this.setState({ toResult: true });
    }

    keyPressed(event) {
        if (event.key === 'Enter') {
            this.handleSubmit(event);
        }
    }

    render() {
        if (this.state.toResult) {
            const newRoute = '/search?keyword=' + this.state.value + '&page=0';
            return <Redirect to={newRoute} />;
        }
        else {
            return (
                <div className='container'>
                    <div className='row home-header'>
                        <div className='row home-logo-div'>
                            <img src={require('../assets/Memegle.png')} className='home-logo' alt='none'/>
                        </div>
                        <div className='row home-search-bar-div'>
                            <div className='col-md-9 center'>
                                <input className='home-search-bar' type='text' placeholder='热门关键词' 
                                    value={this.state.value} onKeyPress={this.keyPressed} onChange={this.handleChange}></input>
                            </div>
                            <div className='col-md-3 center'>
                                <button className='button-search' onClick={this.handleSubmit}><b>搜图 :)</b></button>
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
