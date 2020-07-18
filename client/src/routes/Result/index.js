import React, {Component} from 'react';
import * as QueryString from 'query-string';
import {Redirect} from 'react-router-dom';

import './result.css';
import logo from '../../assets/logo-mm-hollow.png';
import coloredLogo from '../../assets/logo-mm-transparent.png';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { LOG } from "../../util";
import { serverUrl } from "../../App";

class Result extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            imageUrls: [],
            toWelcome: false,
            toNewResult: false,
            value: '',
            logo: logo
        };

        this.queryString = QueryString.parse(this.props.queryString);

        this.handleLogoClick = this.handleLogoClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.keyPressed = this.keyPressed.bind(this);
        this.switchLogo = this.switchLogo.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        //this.loadImages = this.loadImages.bind(this);
        this.handleScrollToBottom = this.handleScrollToBottom.bind(this);
    }

    componentDidMount() {
        LOG('In result page');
        this.setState({value: this.queryString.keyword});

        const searchApi = serverUrl + '/search';

        this.pageNum = this.queryString.page;

        LOG('querying ' + searchApi);
        fetch(searchApi, {
            method: 'POST',
            body: JSON.stringify({
                keyword: this.queryString.keyword,
                page: this.pageNum
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(json => {
                LOG(json);
                this.setState({
                    isLoaded: true,
                    imageUrls: json
                });
            })
            .catch(error => {
                this.setState({
                    isLoaded: true,
                    error: error
                });
            });

            window.addEventListener('scroll', this.handleScrollToBottom, false);
    }


    handleLogoClick(event) {
        event.preventDefault();
        this.setState({toWelcome: true});
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        if (this.state.value === '') {
            return;
        }
        event.preventDefault();
        document.title = this.state.value + " - Memegle";
        this.setState({toNewResult: true});
    }

    keyPressed(event) {
        if (event.key === 'Enter') {
            this.handleSubmit(event);
        }
    }

    switchLogo(event) {
        if (this.state.logo === logo) {
            this.setState({logo: coloredLogo});
        } else {
            this.setState({logo: logo});
        }
    }

    handleScroll(event) {
        const target = event.target;
        if (target.scrollHeight - target.scrollTop === target.clientHeight) {
            console.log('reach bottom');
        }
    }

    handleScrollToBottom = () => {
        console.log(document.body.scrollHeight, document.body.scrollTop, document.body.clientHeight);
        if (document.body.scrollHeight - document.body.scrollTop === document.body.clientHeight) {
            console.log('header bottom reached');
        }
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScrollToBottom, false);
    }

    /*loadImages() {
        this.pageNum++;

        const searchApi = serverUrl + '/search';

        LOG('querying ' + searchApi);
        fetch(searchApi, {
            method: 'POST',
            body: JSON.stringify({
                keyword: this.queryString.keyword,
                page: this.pageNum
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(json => {
                LOG(json);
                this.setState({
                    isLoaded: true,
                    imageUrls: this.state.imageUrls.concat(json)
                });
            })
            .catch(error => {
                this.setState({
                    isLoaded: true,
                    error: error
                });
            });
    }*/

    render() {

        const RenderImages = ({error, isLoaded, imageUrls}) => {
            if (error) {
                return <div>Error: {error.message}</div>;
            } else if (!isLoaded) {
                return <div>Loading...</div>;
            } else {
                return (
                    <React.Fragment>
                        {imageUrls.map(url =>
                            <div className='image-div' key={url}>
                                <img src={url} className='image' alt='none'/>
                                <div className='frame'/>
                            </div>
                        )}
                    </React.Fragment>
                );
            }
        };

        if (this.state.toWelcome) {
            return <Redirect to='welcome'/>;
        } else if (this.state.toNewResult) {
            const newRoute = '/search?keyword=' + this.state.value + '&page=0';
            return <Redirect to={newRoute}/>;
        } else {
            return (
                <div className='container'>
                    <div className='row top'>
                        <div className='img-div'>
                            <img src={this.state.logo} className='logo' alt='none' onClick={this.handleLogoClick}
                                 onMouseEnter={this.switchLogo} onMouseLeave={this.switchLogo}/>
                        </div>
                        <div className='col-9 search-bar-div'>
                            <input className='search-bar' type='text' value={this.state.value} placeholder='关键词'
                                   onKeyPress={this.keyPressed} onChange={this.handleChange}/>
                        </div>
                        <div className='center'>
                            <button className='result-search-button' onClick={this.handleSubmit}><b>搜图 :)</b></button>
                        </div>
                    </div>
                    <div className="row gallery">
                        <RenderImages error={this.state.error} isLoaded={this.state.isLoaded}
                                      imageUrls={this.state.imageUrls}/>
                    </div>
                </div>
            );
        }
    }
}


export default Result;
