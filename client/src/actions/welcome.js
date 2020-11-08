import {serverUrl} from 'App';

export const fetchFact = async () => {
    const url = serverUrl + '/facts';
    let result = '';
    try {
        const response = await fetch(url);
        result = await response.text();
    } catch (e) {
        throw e;
    }

    return result;
}

export const fetchRecommendation = async () => {
    const url = serverUrl + '/recommendations';
    let result = '';

    try {
        const response = await fetch(url);
        result = await response.text();
    } catch (e) {
        throw e;
    }

    return result;
}
