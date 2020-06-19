import React, { Component } from 'react';
import Gallery from 'react-photo-gallery';

class Result extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            images: []
        };
    }

    componentDidMount() {
        fetch("http://memegle.qicp.vip/all")
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result.slice(0, 10));
                    let fisrtTenItems = result.slice(0, 10);
                    this.setState({
                        isLoaded: true,
                        images: fisrtTenItems
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

    createPhotoSet(images) {
        let photoSet = []
        for (let i = 0; i < images.length; i++) {
            console.log(images[i]);
            photoSet.push({src: images[i].url, width: 1, height: 1});
        }
        return photoSet;
    }
    
    render() {
        const { error, isLoaded, images } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            let photoSet = this.createPhotoSet(images);
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