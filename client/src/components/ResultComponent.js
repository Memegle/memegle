import React, { Component } from 'react';
import * as QueryString from 'query-string';
import { Redirect } from 'react-router-dom';
import '../css/result.css';
import logo from '../assets/logo-mm-hollow.png';
import coloredLogo from '../assets/logo-mm-transparent.png';

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
        this.setState({ value: this.queryString.keyword });

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
                this.serverUrl = 'http://memegle.live:8080/search';
                console.log('can\'t reach local server, using ' + this.serverUrl);
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
        document.title = this.state.value + " - Memegle";
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
                                <img src={url} className='image' alt='none' />
                                <div className='frame'></div>
                            </div>
                        )}
                    </React.Fragment>
                );
            }
        }


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
                        <div className='img-div'>
                            <img src={this.state.logo} className='logo' alt='none' onClick={this.handleLogoClick}
                                onMouseEnter={this.switchLogo} onMouseLeave={this.switchLogo}/>
                        </div>
                        <div className='col-9 search-bar-div'>
                            <input className='search-bar' type='text' value={this.state.value} placeholder='关键词'
                                onKeyPress={this.keyPressed} onChange={this.handleChange}></input>
                        </div>
                        <div className='center'>
                                <button className='result-search-button' onClick={this.handleSubmit}><b>搜图 :)</b></button>
                        </div>
                    </div>
                    <div className="row gallery">
                        <RenderImages error={this.state.error} isLoaded={this.state.isLoaded} imageUrls={this.state.imageUrls}/>
                    </div>
                </div>
            );
        }
    }
}


export default Result;
