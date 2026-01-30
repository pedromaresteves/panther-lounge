

module.exports = {
  orderAz: function (a, b) {
    if (a.toUpperCase() < b.toUpperCase()) {
      return -1;
    }
    if (a.toUpperCase() > b.toUpperCase()) {
      return 1;
    }

    // names must be equal
    return 0;
  },
  linkify: function (name) {
    name = name.toLowerCase();
    //name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, ""); DON'T KNOW HOW TO DENORMALIZE THE URLS TO SEARCH IN DB LATER, SO I REMOVE THIS
    return name
  },
  capitalizeName: function (string) {
    let artistCapitalized = [];
    string = string.split(" ");
    string.forEach((word) => {
      word = word[0].toUpperCase() + word.slice(1, word.length)
      artistCapitalized.push(word)
    });
    return artistCapitalized.join(" ");
  },
  encodeChars(str) {
    return encodeURIComponent(str).
      replace(/['()]/g, escape).
      replace(/\*/g, '%2A').
      replace(/%(?:7C|60|5E)/g, unescape);
  },
  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  },
  createCaseInsensitiveRegex(value) {
    return new RegExp(`^${this.escapeRegExp(value)}$`, "gi");
  },
  renderError(res, req, err) {
    return res.render("error.ejs", {
      userData: req.user,
      url: req.url,
      errorMessage: err.message
    });
  }
}