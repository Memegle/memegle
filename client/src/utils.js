export const isProductionMode = () => {
    return process.env.NODE_ENV === 'production';
}

// Please use this function for logging instead of console.log
export const LOG = (msg) => {
    if (!isProductionMode()) {
        console.log(msg);
    }
};