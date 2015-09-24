module.exports = Autowire(function(_, Varchar) {

  function Type(options) {
    if(this instanceof Type) {
      this.type = options;
      this._notNull = false;
      this._primaryKey = false;
      this.default = undefined;
    } else {
      return new Type(options);
    }
  }

  Type.prototype.notNull = function() {
    this._notNull = true;
    return this;
  };

  Type.prototype.primaryKey = function() {
    this._primaryKey = true;
  };

  Type.prototype.toSql = function() {
    var str = [];

    str.push(this.name.toUpperCase()+(this.length ? "("+this.length+")" : ""));

    str.push(this.notNull ? "NOT NULL" : "");
    str.push(this.primaryKey ? "PRIMARY KEY" : "");

    return str.join(" ");
  };

  Type.UUID = Type("uuid");
  Type.VARCHAR = Varchar;

  return Type;
});