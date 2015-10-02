module.exports = Autowire(function(_, util, Type) {
  function Varchar(length) {
    if(this instanceof Varchar) {
      Varchar.super_.call(this, "varchar");
      this._length = length;
    } else {
      return new Varchar(length);
    }
  }

  util.inherits(Varchar, Type);

  var varchar = Varchar();
  Varchar.notNull = function() { return varchar.notNull.call(this); };
  Varchar.toSql = function() { return varchar.toSql.call(this); };

  Type.VARCHAR = Varchar;

  return Varchar;
});