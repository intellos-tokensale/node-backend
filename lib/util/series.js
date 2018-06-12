module.exports = {
    forEach
};

function forEach(array, i, func) {
    if (i >= array.length) {
        return Promise.resolve({});
    }
    return func(array[i]).then(() => {
        return forEach(array, i + 1, func);
    });
}