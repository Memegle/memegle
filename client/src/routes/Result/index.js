import React, {Component} from 'react';
import * as QueryString from 'query-string';
import { Redirect } from 'react-router-dom';

import './result.css';
import logo from '../../assets/logo-mm-hollow.png';
import coloredLogo from '../../assets/logo-mm-transparent.png';
import { LOG } from '../../utils';
import performSearch, { getSearchRoute } from '../../actions/search';

//import Modal from 'react-modal';
//import { Button, Form } from 'react-bootstrap'
import Button from 'react-bootstrap/Button';
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";

const UserFeedback = () => {
    const [isOpen, setIsOpen] = React.useState(true);
    const [title, setTitle] = React.useState("Loading...")

    const showModal = () => {
        setIsOpen(true);
    };

    const hideModal = () => {
        setIsOpen(false);
    };

    const modalLoaded = () => {
        setTitle("Not satisfied with the result? Propose some categories that you would like to see in future searches. :)");
    };

    return (
        <>
            <Modal centered className="modal-feedback" show={isOpen} onHide={hideModal} onEntered={modalLoaded}>
                <Modal.Header className="modal-header">
                    <Modal.Title className="modal-title">{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input className="modal-searchBar" placeholder="Use comma to split each category" type="text" name="fname"></input>
                </Modal.Body>
                <Modal.Footer className="modal-footer">
                    <button className="modal-cancelButton" onClick={hideModal}>算了 :(</button>
                    <button className="modal-saveButton" onClick={hideModal}>好的 :P</button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

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
            logo: logo,
            userFeedback: false
        };

        this.allImages = []
        this.queryString = QueryString.parse(this.props.queryString);
        this.numImagesToFetch = 30;

        this.calculateScreenSize = this.calculateScreenSize.bind(this);
        this.handleLogoClick = this.handleLogoClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.keyPressed = this.keyPressed.bind(this);
        this.switchLogo = this.switchLogo.bind(this);
        this.displayMoreImages = this.displayMoreImages.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.retrieveImages = this.retrieveImages.bind(this);
    }

    componentDidMount() {
        LOG('In result page');
        this.setState({value: this.queryString.keyword});

        this.calculateScreenSize();
        this.retrieveImages();

        window.addEventListener('scroll', this.handleScroll);
        window.addEventListener("resize", this.calculateScreenSize);
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
                /*userFeedback: (error.message === 'Empty result') ?
                    prompt('Looks like no results showed. Please propose some categories that you would like included in future searches. :)')
                    : null*/
            });

            //LOG(this.state.userFeedback)
        })

    }

    displayMoreImages() {
        const startIndex = this.state.images.length;
        const endIndex = startIndex + this.numImagesToFetch;

        if (startIndex >= this.allImages.length) {
            return;
        }

        let newImages = this.state.images.concat(this.allImages.slice(startIndex, endIndex))

        this.setState({
            images: newImages
        })

        LOG(this.allImages);
        LOG(this.state.images);

        LOG("Number of images to fetch: " + this.numImagesToFetch);
    }

    calculateScreenSize() {
        const picPerRow = Math.floor(window.innerWidth / 230.0);
        const picPerCol = Math.floor(window.innerHeight / 230.0);
        LOG('pic per row: ' + picPerRow);
        LOG('pic per col: ' + picPerCol);
        this.numImagesToFetch = picPerRow * picPerCol;
    }

    handleScroll() {
        if (window.innerHeight + document.documentElement.scrollTop >= document.scrollingElement.scrollHeight) {
            LOG('yay')
            this.displayMoreImages();
        }
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
                return  <UserFeedback />;
            } else if (!isLoaded) {
                return <div style={{ color: 'white' }}>Loading...</div>;
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
                        <div className='col-6 search-bar-div'>
                            <input className='search-bar' type='text' value={this.state.value} placeholder='请输入关键词'
                                   onKeyPress={this.keyPressed} onChange={this.handleChange}/>

                            <img src={require('../../assets/icon-magnifier-white.png')}
                                 className='result-magnifier' alt='none'/>
                        </div>
                        <div className='col search-button-div'>
                            <button className='result-search-button' onClick={this.handleSubmit}>搜图 :)</button>
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
