import React, { Component } from 'react';
import Gallery from 'react-photo-gallery';

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
        let url = "http://memegle.qicp.vip/search/" + this.props.location.state.searchKey + "/0";
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

    /*
    renderImage(id, imageUrl) {
        return (
            <div key={id}>
                <img src={imageUrl} alt="none"/>
            </div>
        );
    }
    */

    createPhotoSet(imageUrls) {
        let photoSet = []
        for (let i = 0; i < imageUrls.length; i++) {
            photoSet.push({src: imageUrls[i], width: 1, height: 1});
        }
        return photoSet;
    }
    
    render() {
        const { error, isLoaded, imageUrls } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            let photoSet = this.createPhotoSet(imageUrls);
            console.log(photoSet);
            return (
                /*<div className="gallery">
                    <div className="images">
                        {images.map(image => this.renderImage(image.id, image.url))}
                    </div>
                </div>*/
                <Gallery photos={photoSet} />
            );
        }
    }
}

export default Result;
