import config from 'react-global-configuration';

export const isInDevelopmentMode = () => {
    return process.env.NODE_ENV !== 'production';
};

// Please use this function for logging instead of console.log
export const LOG = (msg) => {
    if (isInDevelopmentMode()) {
        console.log(msg);
    }
};

export const getServerUrl = () => {
    return config.get('serverUrl');
}