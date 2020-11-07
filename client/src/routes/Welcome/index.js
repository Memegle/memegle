import React from 'react';
import {Redirect} from 'react-router-dom';

import {LOG} from 'utils'
import styles from "./welcome.module.css"
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
            <>
                <div className={`row ${styles.header}`}>

                    <img src={require('assets/Memegle.png')} className={styles.logo} alt='none'/>

                    <div className={`row ${styles.searchBarDiv}`}>

                        <div className={`col-10 ${styles.searchBoxDiv}`}>
                            <input className={styles.searchBar} type='text'
                                   placeholder='请输入关键词'
                                   value={this.state.value} onKeyPress={this.keyPressed}
                                   onChange={this.handleTextChange}/>

                            <img src={require('assets/icon-magnifier-white.png')}
                                 className={styles.magnifier} alt='none'/>
                        </div>

                        <div className={`col ${styles.buttonDiv}`}>
                            <button className={styles.button} onClick={this.handleSubmit}>
                                搜图 :)
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    mobileView() {
        return (
            <>
                <img src={require('assets/logo-m-bw.png')} className={styles.mLogo} alt='none'/>

                <div className={styles.mSearchBoxDiv}>
                    <input className={styles.mSearchBox} placeholder='请输入关键词...'
                           value={this.state.value} onKeyPress={this.keyPressed}
                           onChange={this.handleTextChange}/>
                    <img src={require('assets/icon-magnifier-white.png')}
                         className={styles.mMagnifier} alt='none'/>
                </div>

                <button className={styles.mButton} onClick={this.handleSubmit}>
                    搜图 :)
                </button>
            </>
        );
    }

    render() {
        document.title = "Memegle";
        if (this.state.toResult) {
            const newRoute = getSearchRoute(this.state.value)
            document.title = this.state.value + " - Memegle";
            return <Redirect to={newRoute}/>;
        } else {
            return (
                <div className={styles.container}>
                    {this.state.mobileView ? this.mobileView() : this.desktopView()}
                    <div className={styles.fact}>
                        网络表情符号最早来自于1982年美国卡内基梅隆大学Scott E·Fahlman教授在BBS上首次使用的ASCII码”:-)”表示微笑。
                    </div>
                </div>
            );
        }
    }
}

export default Welcome;
