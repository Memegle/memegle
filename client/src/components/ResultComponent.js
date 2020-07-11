import React, { Component } from 'react';
import Gallery from 'react-photo-gallery';
import * as QueryString from 'query-string';
import { Redirect } from 'react-router-dom';
import '../css/result.css';
import logo from '../assets/logo-mm-hollow.png';
import coloredLogo from '../assets/logo-mm-transparent.png';
import frame from '../assets/frame.png';

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
    }

    componentDidMount() {
        const checkServerStatus = () => {
            const timeout = new Promise((resolve, reject) => {
                setTimeout(reject, 30000, 'Request timed out');
            });
        
            const request = fetch('http://localhost:8080/actuator/health');

            console.log('querying localhost...');
            return Promise.race([timeout, request])
                .then(response => {
                    return true;
                })
                .catch(error => {
                    return false;
                })
        }

        checkServerStatus().then(localIsUp => {
            if (localIsUp) {
                console.log('local server is up, using local.');
                this.serverUrl = 'http://localhost:8080/search'
            }
            else {
                console.log('can\'t reach local server, using \'http://memegle.qicp.vip:8080/search\'');
                this.serverUrl = 'http://memegle.qicp.vip:8080/search'
            }

            fetch(this.serverUrl, {
                method: 'POST',
                body: JSON.stringify({
                    keyword: this.queryString.keyword,
                    page: this.queryString.page
                }),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }})
                .then(res => res.json())
                .then(json => {
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
                })
        });
    }

    handleLogoClick(event) {
        event.preventDefault();
        this.setState({ toWelcome: true });
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
        document.title = this.state.value + " - Memegle"
        this.setState({ toNewResult: true });
    }

    keyPressed(event) {
        if (event.key === 'Enter') {
            this.handleSubmit(event);
        }
    }

    switchLogo(event) {
        if (this.state.logo === logo) {
            this.setState({ logo: coloredLogo });
        }
        else {
            this.setState({ logo: logo });
        }
    }
    
    render() {

        /*const RenderImages = ({error, isLoaded, imageUrls}) => {
            if (error) {
                return <div>Error: {error.message}</div>;
            } else if (!isLoaded) {
                return <div>Loading...</div>;
            } else {
                let photoSet = createPhotoSet(imageUrls);
                console.log(photoSet);
                return (
                    <Gallery photos={photoSet} />
                );
            }
        }
        
        const createPhotoSet = (imageUrls) => {
            let photoSet = []
            for (let i = 0; i < imageUrls.length; i++) {
                photoSet.push({src: imageUrls[i], width: 1, height: 1});
            }
            return photoSet;
        }*/


        if (this.state.toWelcome) {
            return <Redirect to='welcome' />;
        }
        else if (this.state.toNewResult) {
            const newRoute = '/search?keyword=' + this.state.value + '&page=0';
            return <Redirect to={newRoute} />;
        }
        else {
            return (
                <div className='container'>
                    <div className='row top'>
                        <div className='col-md-1 img-div'>
                            <img src={this.state.logo} className='logo' alt='none' onClick={this.handleLogoClick}
                                onMouseEnter={this.switchLogo} onMouseLeave={this.switchLogo}/>
                        </div>
                        <div className='col-md-9 search-bar-div'>
                            <input className='search-bar' type='text' value={this.state.value} placeholder='关键词'
                                onKeyPress={this.keyPressed} onChange={this.handleChange}></input>
                        </div>
                        <div className='col-md-2 center'>
                                <button className='button-search' onClick={this.handleSubmit}><b>搜图 :)</b></button>
                        </div>
                    </div>
                    <div className="row">
                        <div className='image-div'>
                            <img src={this.state.imageUrls[0]} className='image' alt='none'/>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

class RenderImages extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.imageUrls !== nextProps.imageUrls;
    }

    render() {
        const createPhotoSet = (imageUrls) => {
            let photoSet = [];
            for (let i = 0; i < imageUrls.length; i++) {
                photoSet.push({src: imageUrls[i], width: 1, height: 1});
            }
            return photoSet;
        };

        let {error, isLoaded, imageUrls} = this.props;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            let photoSet = createPhotoSet(imageUrls);
            console.log(photoSet);
            return (
                <Gallery photos={photoSet} />
            );
        }
    }
}

export default Result;
