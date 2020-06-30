import React, { Component } from 'react';
import Gallery from 'react-photo-gallery';
import * as QueryString from 'query-string';
import { Redirect } from 'react-router-dom';
import '../css/result.css';

class Result extends Component {
    constructor(props) {
        super(props);
        this.state = {
            server: null,
            error: null,
            isLoaded: false,
            imageUrls: [],
            toWelcome: false,
            toNewResult: false,
            value: ''
        };

        this.handleLogoClick = this.handleLogoClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.keyPressed = this.keyPressed.bind(this);
    }

    componentDidMount() {
        const qs = QueryString.parse(this.props.queryString);
        const localServerUrl = 'http://localhost:8080/search';
        const productionServerUrl = 'http://memegle.qicp.vip:8080/search';

        const getImageUrls = (url) => {
            console.log(url);
            fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    keyword: qs.keyword,
                    page: qs.page
                }),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(result => {
                    this.setState({
                        isLoaded: true,
                        imageUrls: result
                    });
                })
                .catch(error => {
                    this.setState({
                        error: error
                    });
                })
        }

        const get = () => {
            const timeout = new Promise((resolve, reject) => {
                setTimeout(reject, 300, 'Request timed out');
            });
        
            const request = fetch(localServerUrl);
        
            return Promise
                .race([timeout, request])
                .then(response => {console.log(response);this.setState({ server: localServerUrl })})
                .catch(error => {console.log(error);this.setState({ server: productionServerUrl })});
        }

        get().then(getImageUrls(this.state.server));

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
        if (this.props.imageUrls === nextProps.imageUrls) {
            return false;
        }
        return true;
    }

    render() {

        const createPhotoSet = (imageUrls) => {
            let photoSet = []
            for (let i = 0; i < imageUrls.length; i++) {
                photoSet.push({src: imageUrls[i], width: 1, height: 1});
            }
            return photoSet;
        }

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
