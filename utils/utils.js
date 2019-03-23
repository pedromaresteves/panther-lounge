

  module.exports = {
    orderAz : function (a, b) {
        if (a.toUpperCase() < b.toUpperCase()) {
          return -1;
        }
        if (a.toUpperCase() > b.toUpperCase()) {
          return 1;
        }
      
        // names must be equal
        return 0;
      },
    linkify : function (name){
      name = name.toLowerCase();
      name = name.replace(/(%20)/g, '_');
      name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      //name = encodeURIComponent(name);
      return name
    },
    unlinkify : function (name){      
      name = name.replace(/_/g, '%20')
      return name
    },
    capitalizeName : function(string){
      let artistCapitalized = [];
      string = string.split(" ");
      string.forEach((word)=>{
        word = word[0].toUpperCase() + word.slice(1, word.length)
        artistCapitalized.push(word)
      });
      return artistCapitalized.join(" ");
    }
  }