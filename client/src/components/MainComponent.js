import React, { Component } from 'react';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  getRandMeme() {
    const Http = new XMLHttpRequest();
    const url='http://localhost:8080/random';
    Http.open("GET", url);
    Http.send();

    /* Http.onreadystatechange = (e) => {
        console.log(Http.responseText);
        document.getElementById('meme').src = Http.responseText
    } */
  }

  render() {
    return(
      <div>
        <h1>欢迎来到Memegle！</h1>

        <p>Memegle仍在开发中，来点表情包？</p>

        <button type="button" onClick={this.getRandMeme}>来一包！</button>
      </div>
    )
  }
}

export default Main;