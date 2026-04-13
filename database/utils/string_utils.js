const normalizeForSearch = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '');

module.exports = { normalizeForSearch };