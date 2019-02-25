

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
      name = name.replace(/\s/g, '-')
      return name
    },
    unhiphenize : function (name){
      name = name.replace(/-/g, ' ')
      return name
    },
  }