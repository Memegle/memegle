import React, {Component} from 'react';

let num='';
const PrintNum = () => {
    func().then(result => {
        num = result;
    })
    return <p>The total number of images is: {num}  </p>;
};

export default PrintNum;


