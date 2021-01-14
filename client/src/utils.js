export const isProductionMode = () => {
    return process.env.NODE_ENV === 'production';
}

export const isStagingMode = () => {
    return process.env.NODE_ENV === 'staging';
}

// Please use this function for logging instead of console.log
export const LOG = (msg) => {
    if (!isProductionMode()) {
        console.log(msg);
    }
};