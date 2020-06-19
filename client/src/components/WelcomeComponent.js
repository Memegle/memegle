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
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
        console.log(this.state.value);
        this.setState({toResult: true});
    }

    keyPressed(event) {
        if (event.key === 'Enter') {
            this.handleSubmit(event);
        }
    }

    render() {
        if (this.state.toResult) {
            return <Redirect to={{
                pathname: '/result',
                state: { searchKey: this.state.value }
            }} />;
        }
        else {
            return (
                <div className='App'>
                    <button className='Button-about'>About</button>
                    <button className='Button-contactUs'>Contact Us</button>
                    <div className='App-header'>
                        <img src={require('../assets/Memegle.png')} className='App-logo' alt='none'/>
                        <input type='text' value={this.state.value} onKeyPress={this.keyPressed} onChange={this.handleChange}></input>
                    </div>
                    <button className='Button-search' onClick={this.handleSubmit}><b>Search</b></button>
                    <button className='Button-feelingLucky'>Feeling Lucky?</button>
                </div>
            );
        }
    }
}

export default Welcome;
