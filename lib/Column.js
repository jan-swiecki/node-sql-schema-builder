module.exports = Autowire(function(_, util){

  function Column(name, type) {
    if(this instanceof Column) {
      this.name = name;
      this.type = type;
      this._default = undefined;
    } else {
      return new Column(name, type);
    }
  }

  Column.prototype.setForeignKey = function(foreignKey) {
    this.foreignKey = foreignKey;
    return this;
  };

  Column.prototype.getForeignKey = function(foreignKey) {
    return this.foreignKey;
  };

  Column.prototype.setName = function(name) {
    this.name = name;
    return this;
  };

  Column.prototype.getName = function(name) {
    return this.name;
  };

  Column.prototype.setType = function(type) {
    this.type = type;
    return this;
  };

  Column.prototype.getType = function(type) {
    return this.type;
  };

  Column.prototype.default = function(def) {
    this._default = def;
    return this;
  };

  Column.prototype.check = function(check) {
    var self = this;
    this._check = check;
    return self;
  };

  Column.prototype.toSql = function() {
    var str = [];
    str.push("\""+this.name+"\"");
    str.push(this.type.toSql());

    if(!_.isUndefined(this._check)) {
      str.push("CHECK");
      str.push("("+this._check+")");
    }

    if(! _.isUndefined(this._default)) {
      var def = _.isString(this._default) ? this._default : JSON.stringify(this._default);
      str.push("DEFAULT '"+def+"'");
    }

    return str.join(" ");
  };

  return Column;

});