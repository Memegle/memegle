import React from 'react';
import { Redirect } from 'react-router-dom';
import '../css/welcome.css';

class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            toResult: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.keyPressed = this.keyPressed.bind(this);
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
        this.setState({ toResult: true });
    }

    keyPressed(event) {
        if (event.key === 'Enter') {
            this.handleSubmit(event);
        }
    }

    render() {
        if (this.state.toResult) {
            const newRoute = '/search?keyword=' + this.state.value + '&page=0';
            return <Redirect to={newRoute} />;
        }
        else {
            return (
                <div>
                    <div className='top-buttons-div'>
                        <button className='top-buttons'>About</button>
                        <button className='top-buttons'>Contact Us</button>
                    </div>
                    <div className='home-header'>
                        <img src={require('../assets/Memegle.png')} className='home-logo' alt='none'/>
                        <input className='home-search-bar' type='text' value={this.state.value} onKeyPress={this.keyPressed} onChange={this.handleChange}></input>
                    </div>
                    <div className='bottom-buttons-div'>
                        <button className='Button-search' onClick={this.handleSubmit}><b>Memegle Search</b></button>
                        <button className='Button-feelingLucky'>Feeling Lucky?</button>
                    </div>
                </div>
            );
        }
    }
}

export default Welcome;
