const profileQueries = require("./profile_queries");
const songQueries = require("./song_queries");

const queries = { ...profileQueries, ...songQueries };

const withErrorHandling = (fn) => async (...args) => {
    try {
        return await fn(...args);
    } catch (error) {
        console.error(`Query error in ${fn.name}:`, error.message);
        throw error;
    }
};

module.exports = Object.keys(queries).reduce((acc, key) => {
    acc[key] = withErrorHandling(queries[key]);
    return acc;
}, {});