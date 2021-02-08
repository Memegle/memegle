
export const count = async () => {
    const url = 'http://www.memegle.live:8080/count';
    let result = '';
    try {
        const response = await fetch(url);
        result = await response.text();
    } catch (e) {
        throw e;
    }
    
    return result;
};

export default count;