import React from 'react';
import {Redirect} from 'react-router-dom';

import {LOG} from 'utils';
import styles from "./welcome.module.css";
import { getSearchRoute } from "actions/search";
import { fetchFact, fetchRecommendation } from "actions/welcome";

class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            toSearch: '',
            mobileView: false,
            fact: '',
            recommendation: '',
        };

        this.factRef = React.createRef();
        this.fetchingFact = false;
        this.fetchingRecommendation = false;

        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.keyPressed = this.keyPressed.bind(this);
        this.handleWindowResize = this.handleWindowResize.bind(this);
        this.fetchNeededData = this.fetchNeededData.bind(this);
    }

    componentDidMount() {
        LOG('In welcome page')

        this.handleWindowResize()
        window.addEventListener("resize", this.handleWindowResize)
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleWindowResize)
    }

    handleWindowResize() {
        this.setState({mobileView: window.innerWidth <= 480})
    }

    handleTextChange(event) {
        this.setState({search: event.target.value});
    }

    handleSubmit(event) {
        const newSearch = this.state.search || this.state.recommendation;

        event.preventDefault();
        this.setState({toSearch: newSearch});
    }

    keyPressed(event) {
        if (event.key === 'Enter') {
            this.handleSubmit(event);
        }
    }

    desktopView() {
        return (
            <>
                <div className={`row ${styles.header}`}>

                    <div className={styles.logo}/>

                    <div className={`row ${styles.searchBarDiv}`}>

                        <div className={`col-10 ${styles.searchBoxDiv}`}>
                            <input autoFocus className={styles.searchBar} type='text'
                                   placeholder={this.state.recommendation}
                                   value={this.state.search} onKeyPress={this.keyPressed}
                                   onChange={this.handleTextChange}/>

                            <img src={require('assets/icon-magnifier-white.png')}
                                 className={styles.magnifier} alt='none'/>
                        </div>

                        <div className={`col ${styles.buttonDiv}`}>
                            <button className={styles.button} onClick={this.handleSubmit}>
                                搜图 :)
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    mobileView() {
        return (
            <>
                <div className={styles.mLogo}/>

                <div className={styles.mSearchBoxDiv}>
                    <input autoFocus className={styles.mSearchBox} placeholder={this.state.recommendation}
                           value={this.state.search} onKeyPress={this.keyPressed}
                           onChange={this.handleTextChange}/>
                    <img src={require('assets/icon-magnifier-white.png')}
                         className={styles.mMagnifier} alt='none'/>
                </div>

                <button className={styles.mButton} onClick={this.handleSubmit}>
                    搜图 :)
                </button>
            </>
        );
    }

    fetchNeededData() {
        if (this.state.fact === '') {
            if (!this.fetchingFact) {
                LOG('fetching facts ')
                this.fetchingFact = true;
                fetchFact()
                    .then(fact => this.setState({fact: fact}))
                    .finally(() => this.fetchingFact = false);
            }
        } else {
            this.factRef.current.innerHTML = this.state.fact;
        }

        if (this.state.recommendation === '' && !this.fetchingRecommendation) {
            LOG('fetching recommendation ')
            this.fetchingRecommendation = true;
            fetchRecommendation()
                .then(recommendation => this.setState({recommendation: recommendation}))
                .finally(() => this.fetchingRecommendation = false);
        }

    }

    render() {
        document.title = "Memegle";

        this.fetchNeededData();

        if (this.state.toSearch) {
            const newRoute = getSearchRoute(this.state.toSearch)
            document.title = this.state.toSearch + " - Memegle";
            return <Redirect to={newRoute}/>;
        } else {
            return (
                <div className={styles.container}>
                    {this.state.mobileView ? this.mobileView() : this.desktopView()}
                    <div className={styles.fact}>
                        <div>{this.state.fact ? "你知道吗？" : ""}</div>
                        <div ref={this.factRef}>{""}</div>
                    </div>
                </div>
            );
        }
    }
}

export default Welcome;
