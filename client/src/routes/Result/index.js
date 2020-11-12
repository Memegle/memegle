import React, {Component} from 'react';
import * as QueryString from 'query-string';
import {Redirect} from 'react-router-dom';
import Modal from "react-bootstrap/Modal";

import styles from "./result.module.css"
import logo from 'assets/logo-mm-hollow.png';
import coloredLogo from 'assets/logo-mm-transparent.png';
import {LOG} from 'utils';
import performSearch, {getSearchRoute} from 'actions/search';
import submitFeedback from "actions/feedback";

class Result extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            images: [],
            toWelcome: false,
            newSearch: null,
            poorResult: false,
        };

        this.allImages = []
        this.keyword = QueryString.parse(this.props.queryString).keyword.trim();
        this.numImagesToAdd = 30;

        this.calculateScreenSize = this.calculateScreenSize.bind(this);
        this.handleLogoClick = this.handleLogoClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.keyPressed = this.keyPressed.bind(this);
        this.displayMoreImages = this.displayMoreImages.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.retrieveImages = this.retrieveImages.bind(this);
        this.handleWindowResize = this.handleWindowResize.bind(this);
        this.handleSubmitFeedback = this.handleSubmitFeedback.bind(this);
        this.hidePopup = this.hidePopup.bind(this);
    }

    componentDidMount() {
        LOG('In result page');
        this.setState({value: this.keyword});

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
        performSearch(this.keyword).then(result => {
            this.allImages = result;
            this.displayMoreImages();
            this.setState({isLoaded: true});
            this.handleScroll(); // Load more images if no scroll bar is present
        }).catch(error => {
            this.setState({
                error: error,
                poorResult: error.message === '似乎没有找到符合要求的图片',
            });
        });
    }

    isResultPoor(images) {
        return images.length < 5;
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

        LOG("Number of images to add: " + this.numImagesToAdd);
    }

    calculateScreenSize() {
        let picPerRow, picPerCol;
        if (window.innerWidth > 720) {
            picPerRow = Math.floor(window.innerWidth / 230.0);
            picPerCol = Math.floor(window.innerHeight / 230.0);
        } else {
            picPerRow = 1;
            picPerCol = Math.floor(window.innerHeight / (0.75 * window.innerWidth));
        }

        if (picPerRow === 0) picPerRow = 1;
        if (picPerCol === 0) picPerCol = 1;
        LOG('pic per row: ' + picPerRow);
        LOG('pic per col: ' + picPerCol);
        this.numImagesToAdd = picPerRow * picPerCol;
    }

    handleScroll() {
        if (window.innerHeight + document.documentElement.scrollTop >=
            document.scrollingElement.scrollHeight) {
            this.displayMoreImages();
        }
    }

    handleLogoClick(event) {
        event.preventDefault();
        this.setState({toWelcome: true});
    }

    handleSubmit(event) {
        event.preventDefault();
        const keyword = document.getElementById("searchBox").value;
        document.title = keyword + " - Memegle";
        this.setState({newSearch: keyword});
    }

    keyPressed(event) {
        if (event.key === 'Enter') {
            if (event.target.id === 'searchBox')
                this.handleSubmit(event);
            else if (event.target.id === 'feedback')
                this.handleSubmitFeedback();
        }
    }

    displayColoredLogo(event) {
        event.currentTarget.src = coloredLogo;
    }

    displayBwLogo(event) {
        event.currentTarget.src = logo;
    }

    handleSubmitFeedback() {
        const feedback = document.getElementById('feedback').value;
        submitFeedback(feedback);
        this.hidePopup();
        //TODO: show thank you snackbar or popup
    }

    hidePopup() {
        this.setState({poorResult: false});
    }

    showPopup() {
        return (
            /* modal is causing warnings, to prevent warnings, add animation={false} */
            <Modal centered show={this.state.poorResult} onHide={this.hidePopup}>
                <div className={styles.modalContent}>
                    <Modal.Header className={styles.modalHeader}>
                        <Modal.Title className={styles.modalTitle}>
                            搜索结果不尽人意？向我们提供您希望在Memegle上见到的表情包关键词吧。
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={styles.modalBody}>
                        <input className={styles.modalInput} placeholder="请使用逗号分隔关键词"
                               type="text" id="feedback" onKeyPress={this.keyPressed}/>
                    </Modal.Body>
                    <Modal.Footer className={styles.modalFooter}>
                        <button className={styles.cancelButton} onClick={this.hidePopup}>
                            算了 :(
                        </button>
                        <button className={styles.saveButton} onClick={this.handleSubmitFeedback}>
                            好的 :p
                        </button>
                    </Modal.Footer>
                </div>
            </Modal>
        );
    }

    render() {
        if (this.state.toWelcome) {
            return <Redirect to='welcome'/>;
        } else if (this.state.newSearch) {
            LOG('to new search')
            const newRoute = getSearchRoute(this.state.newSearch)
            return <Redirect to={newRoute}/>;
        } else {
            const RenderImages = ({error, isLoaded, images}) => {
                LOG("Rendering images")
                if (error) {
                    return <div className={styles.error}>啊噢，{error.message} ಥ_ಥ</div>;
                } else if (!isLoaded) {
                    return <div className={styles.error}>拼命找图中 (๑•́ ₃ •̀๑)...</div>;
                } else {
                    return (
                        <React.Fragment>
                            {images.map(image => {
                                let height, width;
                                if (image.height > image.width) {
                                    height = 78;
                                    width = 78 * image.width / image.height;
                                } else {
                                    width = 78;
                                    height = 78 * image.height / image.width;
                                }
                                return (
                                    <div className={styles.image} key={image.id}>
                                        <img src={image.fullUrl} style={{height: height + '%', width: width + '%'}}
                                             alt='none'/>
                                        <div className={styles.frame}/>
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    );
                }
            };
            return (
                <div className={styles.container}>
                    <div className={`row ${styles.top}`}>
                        <img src={logo} className={styles.logo} alt='none'
                            onContextMenu={(e)=> e.preventDefault()} 
                            onClick={this.handleLogoClick}
                            onMouseOver={this.displayColoredLogo}
                            onMouseOut={this.displayBwLogo}
                            onTouchStart={this.displayColoredLogo}
                            onTouchEnd={this.displayBwLogo} />
                        <div className={styles.searchBarDiv}>
                            <input className={styles.searchBar} id='searchBox' type='text'
                                   defaultValue={this.keyword}
                                   placeholder='请输入关键词' onKeyPress={this.keyPressed}/>

                            <img src={require('assets/icon-magnifier-white.png')}
                                 className={styles.magnifier} alt='none'/>
                        </div>
                        <button className={styles.searchButton} onClick={this.handleSubmit}>搜图 :)</button>
                    </div>
                    <div className={`row ${styles.gallery}`}>
                        <RenderImages error={this.state.error} isLoaded={this.state.isLoaded}
                                      images={this.state.images}/>
                    </div>

                    {this.state.poorResult && this.showPopup()}
                </div>
            );
        }
    }
}

export default Result;
