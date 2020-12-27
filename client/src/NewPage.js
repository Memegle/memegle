import React, {Component} from 'react';

export const func = async () => {
    const url = 'http://www.memegle.live:8080/count';
    let result = '';
    try {
        const response = await fetch(url);
        result = await response.text();
    } catch (e) {
        throw e;
    }

    return result;
}
let num='';

func().then(result => {
    num = result;
})


const NewPage = () => {
return(
    <p>The total number of images is: {num} </p>
)
};

export default NewPage;
