module.exports = require('autowire')(function(_) {

  return {
    toTimestamp: function(date) {
      function prefix(x) {
        return x < 10 ? "0"+x : x+"";
      }

      return date.getFullYear() +
        "-" + prefix(date.getMonth() + 1) +
        "-" + prefix(date.getDay() + 1) +
        " " + prefix(date.getHours()) +
        ":" + prefix(date.getMinutes()) +
        ":" + prefix(date.getSeconds());
    }
  }

});