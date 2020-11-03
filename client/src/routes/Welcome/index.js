import React from 'react';
import {Redirect} from 'react-router-dom';

import {LOG} from 'utils'
import './welcome.css';
import {getSearchRoute} from "actions/search";

class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            toResult: false,
            mobileView: false,
        };

        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.keyPressed = this.keyPressed.bind(this);
        this.handleWindowResize = this.handleWindowResize.bind(this);
    }

    componentDidMount() {
        LOG('In welcome page')

        this.handleWindowResize()
        window.addEventListener("resize", this.handleWindowResize)
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleWindowResize)
    }

    handleWindowResize() {
        this.setState({mobileView: window.innerWidth <= 480})
    }

    handleTextChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        if (this.state.value === '') {
            return;
        }
        event.preventDefault();
        this.setState({toResult: true});
    }

    keyPressed(event) {
        if (event.key === 'Enter') {
            this.handleSubmit(event);
        }
    }

    desktopView() {
        return (
            <div className='container'>
                <div className='row home-header'>

                    <div className='row home-logo-div'>
                        <img src={require('assets/Memegle.png')} className='home-logo' alt='none'/>
                    </div>

                    <div className='row home-search-bar-div'>

                        <div className='col-10 search-box-div'>
                            <input className='home-search-bar' type='text'
                                   placeholder='请输入关键词'
                                   value={this.state.value} onKeyPress={this.keyPressed}
                                   onChange={this.handleTextChange}/>

                            <img src={require('assets/icon-magnifier-white.png')}
                                 className='home-magnifier' alt='none'/>
                        </div>

                        <div className='col button-search-div'>
                            <button className='button-search' onClick={this.handleSubmit}>
                                搜图 :)
                            </button>
                        </div>
                    </div>
                </div>

                <div className='text'>
                    网络表情符号最早来自于1982年美国卡内基梅隆大学Scott E·Fahlman教授在BBS上首次使用的ASCII码”:-)”表示微笑。
                </div>
            </div>
        );
    }

    mobileView() {
        return (
            <div className='container'>
                <img src={require('assets/logo-m-bw.png')} className='mobile-logo' alt='none'/>

                <div className='mobile-search-box-div'>
                    <input className='mobile-search-box' placeholder='请输入关键词...'
                           value={this.state.value} onKeyPress={this.keyPressed}
                           onChange={this.handleTextChange}/>
                    <img src={require('assets/icon-magnifier-white.png')}
                         className='mobile-magnifier' alt='none'/>
                </div>

                <button className='mobile-search-button' onClick={this.handleSubmit}>
                    搜图 :)
                </button>

                <div className='text'>
                    网络表情符号最早来自于1982年美国卡内基梅隆大学Scott E·Fahlman教授在BBS上首次使用的ASCII码”:-)”表示微笑。
                </div>
            </div>
        );
    }

    render() {
        document.title = "Memegle";
        if (this.state.toResult) {
            const newRoute = getSearchRoute(this.state.value)
            document.title = this.state.value + " - Memegle";
            return <Redirect to={newRoute}/>;
        } else {
            return this.state.mobileView ? this.mobileView() : this.desktopView();
        }
    }
}

export default Welcome;
