module.exports = Autowire(function(_) {

  function Type(name) {
    if(this instanceof Type) {
      this.name = name;
      this._notNull = false;
      this._primaryKey = false;
      this.default = undefined;
    } else {
      return new Type(name);
    }
  }

  Type.prototype.notNull = function() {
    this._notNull = true;
    return this;
  };

  Type.prototype.primaryKey = function() {
    this._primaryKey = true;
    return this;
  };

  Type.prototype.toSql = function() {
    var str = [];

    str.push(this.name.toUpperCase()+(this.length ? "("+this.length+")" : ""));

    if(this._notNull) {
      str.push("NOT NULL");
    }

    if(this._primaryKey) {
      str.push("PRIMARY KEY");
    }

    return str.join(" ");
  };

  Type.UUID = Type("uuid");

  return Type;
});