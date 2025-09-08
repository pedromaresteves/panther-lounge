const profileQueries = require("./profile_queries");
const songQueries = require("./song_queries");

module.exports = { ...profileQueries, ...songQueries }