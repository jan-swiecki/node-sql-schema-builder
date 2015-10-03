module.exports = Autowire(function(_) {

  function Type(name) {
    if(this instanceof Type) {
      this.name = name;
      this._notNull = false;
      this._primaryKey = false;
      this.additionalKeywords = [];
    } else {
      return new Type(name);
    }
  }

  Type.prototype.clone = function() {
    var clone = Object.create(Type.prototype);
    _.extend(clone, this);
    return clone;
  };

  Type.prototype.notNull = function() {
    var clone = this.clone();
    clone._notNull = true;
    return clone;
  };

  Type.prototype.length = function(length) {
    var clone = this.clone();
    clone._length = length;
    return clone;
  };

  Type.prototype.addKeyword = function(keyword) {
    var self = this;
    this.additionalKeywords.push(keyword);
  };

  Type.prototype.primaryKey = function() {
    var clone = this.clone();
    clone._primaryKey = true;
    return clone;
  };

  Type.prototype.is = function(other) {
    return this.name === other.name;
  };

  Type.prototype.toSql = function() {
    var str = [];

    str.push(this.name.toUpperCase()+(!_.isUndefined(this._length) ? "("+this._length+")" : ""));

    _.each(this.additionalKeywords, function(keyword){
      str.push(keyword);
    });

    if(this._notNull === true) {
      str.push("NOT NULL");
    }

    if(this._primaryKey === true) {
      str.push("PRIMARY KEY");
    }

    return str.join(" ");
  };

  Type.UUID = Type("uuid");
  Type.JSON = Type("json");
  Type.INT = Type("int");
  Type.TEXT = Type("text");

  return Type;
});