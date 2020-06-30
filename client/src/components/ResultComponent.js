import React, { Component } from 'react';
import Gallery from 'react-photo-gallery';
import * as QueryString from 'query-string';
import { Redirect } from 'react-router-dom';
import '../css/result.css';

class Result extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            imageUrls: [],
            toWelcome: false,
            toNewResult: false,
            value: ''
        };

        this.queryString = QueryString.parse(this.props.queryString);

        this.handleLogoClick = this.handleLogoClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.keyPressed = this.keyPressed.bind(this);
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
        this.setState({ toNewResult: true });
    }

    keyPressed(event) {
        if (event.key === 'Enter') {
            this.handleSubmit(event);
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
                        <div className='col-md-3 img-div'>
                            <img src={require('../assets/Memegle.png')} className='logo' alt='none' onClick={this.handleLogoClick} />
                        </div>
                        <div className='col-md-9 search-bar-div'>
                            <input className='search-bar' type='text' value={this.state.value} onKeyPress={this.keyPressed} onChange={this.handleChange}></input>
                        </div>
                    </div>
                    <div className="row">
                        <RenderImages error={this.state.error}
                            isLoaded={this.state.isLoaded}
                            imageUrls={this.state.imageUrls} />
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
