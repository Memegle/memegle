import { serverUrl } from 'App';
import { LOG } from "utils";

const submitFeedback = async (feedback) => {
    if (feedback === "") {
        throw Error("反馈不能为空，请输入反馈信息!")
    }
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
    if (!response || response.status !== 200) {
        const json = await response.json();
        throw Error(json.message);
    }
};

export default submitFeedback;