module.exports = Autowire(function(_) {

  function Type(name) {
    if(this instanceof Type) {
      this.name = name;
    } else {
      return new Type(name);
    }
  }

  Type.prototype.clone = function() {
    var clone = Object.create(Type.prototype);
    _.extend(clone, this);
    return clone;
  };

  Type.prototype.length = function(length) {
    var clone = this.clone();
    clone._length = length;
    return clone;
  };

  Type.prototype.getLength = function() {
    return this._length;
  };

  Type.prototype.hasLength = function() {
    return ! _.isUndefined(this._length);
  };

  Type.prototype.is = function(other) {
    return this.name === other.name;
  };

  Type.prototype.toSql = function() {
    return this.name.toUpperCase()+(!_.isUndefined(this._length) ? "("+this._length+")" : "");
  };

  Type.UUID = Type("uuid");
  Type.JSON = Type("json");
  Type.INT = Type("int");
  Type.TEXT = Type("text");
  Type.TIMESTAMP = Type("timestamp");
  Type.TIMESTAMPTZ = Type("timestamp with time zone");

  return Type;
});