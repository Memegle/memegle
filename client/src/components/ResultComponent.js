import React, { Component } from 'react';
import Gallery from 'react-photo-gallery';
import * as QueryString from 'query-string';
import '../css/result.css';

class Result extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            imageUrls: []
        };
    }

    componentDidMount() {
        const qs = QueryString.parse(this.props.queryString);
        let url = 'http://memegle.qicp.vip/search/' + qs.keyword + '/' + qs.page;
        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        imageUrls: result
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error: error
                    });
                }
            )
    }
    
    render() {

        const RenderImages = ({error, isLoaded, imageUrls}) => {
            if (error) {
                return <div>Error: {error.message}</div>;
            } else if (!isLoaded) {
                return <div>Loading...</div>;
            } else {
                let photoSet = createPhotoSet(imageUrls);
                console.log(photoSet);
                return (
                    <Gallery photos={photoSet} />
                );
            }
        }
        
        const createPhotoSet = (imageUrls) => {
            let photoSet = []
            for (let i = 0; i < imageUrls.length; i++) {
                photoSet.push({src: imageUrls[i], width: 1, height: 1});
            }
            return photoSet;
        }

        return (
            <div>
                <div class='search-bar'>
                    <input type='text' value={this.state.value} onKeyPress={this.keyPressed} onChange={this.handleChange}></input>
                </div>
                <div>
                    <RenderImages error={this.state.error}
                        isLoaded={this.state.isLoaded}
                        imageUrls={this.state.imageUrls} />
                </div>
            </div>
        );
    }
}

export default Result;
