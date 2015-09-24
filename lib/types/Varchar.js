module.exports = Autowire(function(_, util, Type) {
  function Varchar(length) {
    if(this instanceof Varchar) {
      this.length = length;
    } else {
      return new Varchar(length);
    }
  }

  util.extend(Varchar, Type);

  return Varchar;
});