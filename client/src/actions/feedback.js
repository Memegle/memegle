import { serverUrl } from 'App';
import { LOG } from "utils";

const submitFeedback = async (feedback) => {
    const processed = feedback.replaceAll('，', ',');
    const parts = processed.split(',').map(item => item.trim());
    const uniq_parts = [...new Set(parts)]

    const url = serverUrl + '/feedback';
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(uniq_parts),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
    })

    LOG(response);
};

export default submitFeedback;