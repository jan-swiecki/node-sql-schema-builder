module.exports = Autowire(function(_, util, Type) {
  function varchar(length) {
    if(this instanceof varchar) {
      varchar.super_.call(this, "varchar");
      this._length = length;
    } else {
      return new varchar(length);
    }
  }

  util.inherits(varchar, Type);

  var instance = varchar();
  varchar.notNull = function() { return instance.notNull.call(this); };
  varchar.toSql = function() { return instance.toSql.call(this); };
  varchar.hasLength = function() { return instance.hasLength.call(this); };
  varchar.getLength = function() { return instance.getLength.call(this); };

  Type.VARCHAR = varchar;

  return varchar;
});