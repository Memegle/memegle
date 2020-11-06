import React, {Component} from 'react';
import * as QueryString from 'query-string';
import { Redirect } from 'react-router-dom';

import './result.css';
import logo from 'assets/logo-mm-hollow.png';
import coloredLogo from 'assets/logo-mm-transparent.png';
import { LOG } from 'utils';
import performSearch, { getSearchRoute } from 'actions/search';

class Result extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            images: [],
            toWelcome: false,
            newSearch: null,
            logo: logo,
            poorResult: false,
        };

        this.allImages = []
        this.queryString = QueryString.parse(this.props.queryString);
        this.numImagesToAdd = 30;

        this.calculateScreenSize = this.calculateScreenSize.bind(this);
        this.handleLogoClick = this.handleLogoClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.keyPressed = this.keyPressed.bind(this);
        this.switchLogo = this.switchLogo.bind(this);
        this.displayMoreImages = this.displayMoreImages.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.retrieveImages = this.retrieveImages.bind(this);
        this.handleWindowResize = this.handleWindowResize.bind(this);
    }

    componentDidMount() {
        LOG('In result page');
        this.setState({value: this.queryString.keyword});

        this.calculateScreenSize();
        this.retrieveImages();
        this.handleWindowResize();

        window.addEventListener('scroll', this.handleScroll);
        window.addEventListener("resize", this.calculateScreenSize);
        window.addEventListener("resize", this.handleWindowResize)
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleWindowResize)
    }

    handleWindowResize() {
        this.setState({mobileView: window.innerWidth <= 480})
    }

    retrieveImages() {
        performSearch(this.queryString.keyword).then(result => {
            this.allImages = result;
            this.displayMoreImages();
            this.setState({isLoaded: true});
            this.handleScroll(); // Load more images if no scroll bar is present
        }).catch(error => {
            this.setState({
                error: error,
            });
        }).finally(() => {
            const poorResult = this.isResultPoor(this.allImages);
            LOG("poor result? " + poorResult);
            this.setState({poorResult: poorResult});
        })
    }

    isResultPoor(images) {
        // Scores are generally low if the query consists of only one Chinese character.
        if (this.queryString.keyword.length < 2) {
            return false;
        }

        if (images.length < 5) {
            return true;
        }

        // Check the top 5 results
        const toCheck = 5;
        const sum = images.slice(0, toCheck).map(image => image.searchScore)
            .reduce((sum, cur) => sum + cur, 0);
        const avg = sum / toCheck;

        // If there are at least two matched characters, the score is generally higher than 10.
        return avg < 10;
    }

    displayMoreImages() {
        const startIndex = this.state.images.length;
        const endIndex = startIndex + this.numImagesToAdd;

        if (startIndex >= this.allImages.length) {
            return;
        }

        let newImages = this.state.images.concat(this.allImages.slice(startIndex, endIndex))

        this.setState({
            images: newImages
        })

        LOG(this.allImages);
        LOG(this.state.images);

        LOG("Number of images to fetch: " + this.numImagesToAdd);
    }

    calculateScreenSize() {
        const picPerRow = Math.floor(window.innerWidth / 230.0);
        const picPerCol = Math.floor(window.innerHeight / 230.0);
        LOG('pic per row: ' + picPerRow);
        LOG('pic per col: ' + picPerCol);
        this.numImagesToAdd = picPerRow * picPerCol;
    }

    handleScroll() {
        if (window.innerHeight + document.documentElement.scrollTop >= document.scrollingElement.scrollHeight) {
            this.displayMoreImages();
        }
    }

    handleLogoClick(event) {
        event.preventDefault();
        this.setState({toWelcome: true});
    }

    handleSubmit(event) {
        event.preventDefault();
        document.title = event.target.value + " - Memegle";
        this.setState({newSearch: event.target.value});
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

    DesktopMobileView() {
        const mobile = this.state.mobileView;
        const RenderImages = ({error, isLoaded, images}) => {
            LOG("Rendering images")
            if (error) {
                return <div className="error">啊噢，{error.message} ಥ_ಥ</div>;
            } else if (!isLoaded) {
                return <div style={{ margin: `5px 5px`, color: 'white' }}>拼命找图中 (๑•́ ₃ •̀๑)...</div>;
            } else {
                return (
                    <React.Fragment>
                        {images.map(image => {
                            let height, width;
                            if (image.height > image.width) {
                                height = 78;
                                width = 78 * image.width / image.height;
                            }
                            else {
                                width = 78;
                                height = 78 * image.height / image.width;
                            }
    
                            if (mobile) {
                                return (
                                    <div className='mobile-row'>
                                        <div className='mobile-image-div' key={image.id}>
                                            <img src={image.fullUrl} style={{ height: height + '%', width: width + '%' }} alt='none' />
                                            <div className='mobile-frame' />
                                        </div>
                                    </div>
                                );
                            }
                            else {
                                return (
                                    <div className='image-div' key={image.id}>
                                        <img src={image.fullUrl} style={{ height: height + '%', width: width + '%' }} alt='none' />
                                        <div className='frame' />
                                    </div>
                                );
                            }
                        })}
                    </React.Fragment>
                );
            }
        };

        if (mobile) {
            return (
                <div className='container'>
                    <div className='row top'>
                        <div className='img-div'>
                            <img src={this.state.logo} className='logo' alt='none' onClick={this.handleLogoClick}
                                 onMouseEnter={this.switchLogo} onMouseLeave={this.switchLogo}/>
                        </div>
                        <div className='col-6 mobile-search-bar-div'>
                            <input className='mobile-search-bar' type='text' defaultValue={this.queryString.keyword}
                                   placeholder='请输入关键词' onKeyPress={this.keyPressed} />
    
                            <img src={require('assets/icon-magnifier-white.png')}
                                 className='mobile-result-magnifier' alt='none'/>
                        </div>
                        <div className='mobile-search-button-div'>
                            <button className='mobile-result-search-button' onClick={this.handleSubmit}>搜图 :)</button>
                        </div>
                    </div>
                    <div className="row gallery">
                        <RenderImages error={this.state.error} isLoaded={this.state.isLoaded}
                                      images={this.state.images}/>
                    </div>
                </div>
            );
        } 
        else {
            return (
                <div className='container'>
                    <div className='row top'>
                        <div className='img-div'>
                            <img src={this.state.logo} className='logo' alt='none' onClick={this.handleLogoClick}
                                onMouseEnter={this.switchLogo} onMouseLeave={this.switchLogo} />
                        </div>
                        <div className='col-6 search-bar-div'>
                            <input className='search-bar' type='text' defaultValue={this.queryString.keyword}
                                   placeholder='请输入关键词' onKeyPress={this.keyPressed} />

                            <img src={require('assets/icon-magnifier-white.png')}
                                className='result-magnifier' alt='none' />
                        </div>
                        <div className='col search-button-div'>
                            <button className='result-search-button' onClick={this.handleSubmit}>搜图 :)</button>
                        </div>
                    </div>
                    <div className="row gallery">
                        <RenderImages error={this.state.error} isLoaded={this.state.isLoaded}
                            images={this.state.images} />
                    </div>
                </div>
            );
        }
    }

    render() {
        if (this.state.toWelcome) {
            return <Redirect to='welcome'/>;
        } else if (this.state.newSearch) {
            const newRoute = getSearchRoute(this.state.newSearch)
            return <Redirect to={newRoute}/>;
        } else {
            return this.DesktopMobileView();
        }
    }
}

export default Result;
