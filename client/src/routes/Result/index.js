import React, {Component} from 'react';
import * as QueryString from 'query-string';
import { Redirect } from 'react-router-dom';

import './result.css';
import logo from '../../assets/logo-mm-hollow.png';
import coloredLogo from '../../assets/logo-mm-transparent.png';
import { LOG } from '../../utils';
import performSearch from '../../actions/search';

class Result extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            images: [],
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
        LOG('In result page');
        this.setState({value: this.queryString.keyword});

        performSearch(this.queryString.keyword, this.queryString.page)
            .then(images => {
                LOG("Search result: " + images)
                this.setState({
                    isLoaded: true,
                    images: images,
                })
            })
            .catch(error => {
                this.setState({
                    isLoaded: true,
                    error: error,
                })
            })
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
            const newRoute = '/search?keyword=' + this.state.value + '&page=1';
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
                                      images={this.state.images}/>
                    </div>
                </div>
            );
        }
    }
}


export default Result;
