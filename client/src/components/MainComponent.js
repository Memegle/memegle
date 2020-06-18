import React, { Component } from 'react';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return(
        <div className="App">
          <button className="Button-about">About</button>
          <button className="Button-contactUs">Contact Us</button>
          <div className="App-header">
            <img src={require('./Memegle.png')} className="App-logo" />
            <input type="text" placeholder="Search..."></input>
          </div>
          <button className="Button-search"><b>Search</b></button>
          <button className="Button-feelingLucky">Feeling Lucky?</button>
        </div>
    )
  }
}

export default Main;