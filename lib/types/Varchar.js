module.exports = Autowire(function(_, util, Type) {
  function Varchar(length) {
    if(this instanceof Varchar) {
      Varchar.super_.call(this, "varchar");
      this.length = length;
    } else {
      return new Varchar(length);
    }
  }

  util.inherits(Varchar, Type);

  Type.VARCHAR = Varchar;

  return Varchar;
});