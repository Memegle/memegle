import * as React from "react";


class InfiniteScroll extends React.Component {

    handleScroll = () => {
        var lastLi = document.querySelector("ul.container > li:last-child");
        var lastLiOffset = lastLi.offsetTop + lastLi.clientHeight;
        var pageOffset = window.pageYOffset + window.innerHeight;
        if (pageOffset > lastLiOffset) {
            this.loadMore();
        }
    };

    render() {
        return <div />;
    }
}
export default InfiniteScroll;