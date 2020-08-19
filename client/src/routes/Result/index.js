import React, {Component} from 'react';
import * as QueryString from 'query-string';
import { Redirect } from 'react-router-dom';

import './result.css';
import logo from '../../assets/logo-mm-hollow.png';
import coloredLogo from '../../assets/logo-mm-transparent.png';
import { LOG } from '../../utils';
import performSearch, { getSearchRoute } from '../../actions/search';

let numImagesToFetch = 30;

class Result extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            images: [],
            allImages: [],
            toWelcome: false,
            toNewResult: false,
            value: '',
            logo: logo,
        };

        this.queryString = QueryString.parse(this.props.queryString);

        this.calculateScreenSize = this.calculateScreenSize.bind(this);
        this.handleLogoClick = this.handleLogoClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.keyPressed = this.keyPressed.bind(this);
        this.switchLogo = this.switchLogo.bind(this);
        this.loadImages = this.loadImages.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    loadImages() {
        performSearch(this.queryString.keyword)
            .then(images => {
                this.setState({
                    isLoaded: true,
                    images: this.state.images.concat(images.slice(this.state.images.length, numImagesToFetch)),
                    allImages: this.state.allImages.concat(images),
                    value: this.queryString.keyword,
                })
            })
            .catch(error => {
                this.setState({
                    isLoaded: true,
                    error: error,
                })
            })

        var allImagesCopy = this.state.allImages.map((x) => x);
        this.setState({ images: this.state.images.concat(allImagesCopy.splice(this.state.images.length, numImagesToFetch)) });

        LOG("Number of images to fetch: " + numImagesToFetch);
        LOG(this.state.images.length);
        LOG(this.state.allImages.length);
    }

    calculateScreenSize() {
        numImagesToFetch = Math.ceil((window.innerHeight / 250.0) * (window.innerWidth / 250.0));
    }

    handleScroll() {
        if (window.innerHeight + document.documentElement.scrollTop === document.scrollingElement.scrollHeight) {
            LOG("YAY");
            this.loadImages();
        }
    }

    componentDidMount() {
        LOG('In result page');
        this.setState({value: this.queryString.keyword});

        this.calculateScreenSize();
        this.loadImages();
        window.addEventListener('scroll', this.handleScroll)
        window.addEventListener("resize", this.calculateScreenSize);
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

    render() {

        const RenderImages = ({error, isLoaded, images}) => {
            if (error) {
                return <div className="error">Error: {error.message}</div>;
            } else if (!isLoaded) {
                return <div>Loading...</div>;
            } else {
                return (
                    <React.Fragment>
                        {images.map(image => {

                            var height, width;
                            if (image.height > image.width) {
                                height = 78;
                                width = 78 * image.width / image.height;
                            }
                            else {
                                width = 78;
                                height = 78 * image.height / image.width;
                            }

                            return (
                                <div className='image-div' key={image.id}>
                                    <img src={image.fullUrl} style={{height: height+'%', width: width+'%'}} alt='none' />
                                    <div className='frame' />
                                </div>
                            );
                        })}
                    </React.Fragment>
                );
            }
        };


        if (this.state.toWelcome) {
            return <Redirect to='welcome'/>;
        } else if (this.state.toNewResult) {
            const newRoute = getSearchRoute(this.state.value)
            return <Redirect to={newRoute}/>;
        } else {
            return (
                <div className='container'>
                    <div className='row top'>
                        <div className='img-div'>
                            <img src={this.state.logo} className='logo' alt='none' onClick={this.handleLogoClick}
                                 onMouseEnter={this.switchLogo} onMouseLeave={this.switchLogo}/>
                        </div>
                        <div className='col-10 search-bar-div'>
                            <input className='search-bar' type='text' value={this.state.value} placeholder='请输入关键词'
                                   onKeyPress={this.keyPressed} onChange={this.handleChange}/>

                            <img src={require('../../assets/icon-magnifier-white.png')}
                                 className='result-magnifier' alt='none'/>
                        </div>
                        <div className='col search-button-div'>
                            <button className='result-search-button' onClick={this.handleSubmit}><b>搜图 :)</b></button>
                        </div>
                    </div>
                    <div className="row gallery">
                        <RenderImages error={this.state.error} isLoaded={this.state.isLoaded}
                                      images={this.state.images}/>
                    </div>
                </div>
            );
        }
    }
}

export default Result;
