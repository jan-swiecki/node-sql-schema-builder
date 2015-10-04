module.exports = Autowire(function(_, util){

  function Column(name, type) {
    if(this instanceof Column) {
      this.name = name;
      this.type = type;
      this._notNull = false;
      this._primaryKey = false;
      this._default = undefined;
      this.additionalKeywords = [];
      this.validator = function() { return false; };
    } else {
      return new Column(name, type);
    }
  }

  Column.prototype.clone = function() {
    var clone = Object.create(Column.prototype);
    _.extend(clone, this);
    return clone;
  };

  Column.prototype.getValidationProperties = function() {
    var self = this;
    var properties = {
      isNull: !self._notNull,
      isUnique: self._primaryKey,
      hasLength: self.type.hasLength()
    };

    properties.type = self.type.name;
    if(properties.type === "varchar" || properties.type === "text") {
      properties.type = "string";
    }
    properties.length = self.type.getLength();
    properties.default = this._default;
    properties.hasDefault = typeof this._default !== 'undefined';

    return properties;
  };

  Column.prototype.validate = function(value) {
    return this.validator(value);
  };

  Column.prototype.primaryKey = function() {
    var clone = this.clone();
    clone._primaryKey = true;
    return clone;
  };

  Column.prototype.notNull = function() {
    var clone = this.clone();
    clone._notNull = true;
    return clone;
  };

  Column.prototype.isNotNull = function() {
    return this._notNull;
  };

  Column.prototype.setForeignKey = function(foreignKey) {
    this.foreignKey = foreignKey;
    return this;
  };

  Column.prototype.getForeignKey = function(foreignKey) {
    return this.foreignKey;
  };

  Column.prototype.addKeyword = function(keyword) {
    var self = this;
    this.additionalKeywords.push(keyword);
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

    if(this._notNull === true) {
      str.push("NOT NULL");
    }

    if(this._primaryKey === true) {
      str.push("PRIMARY KEY");
    }

    if(! _.isUndefined(this._default)) {
      var def = _.isString(this._default) ? this._default : JSON.stringify(this._default);
      str.push("DEFAULT '"+def+"'");
    }

    _.each(this.additionalKeywords, function(keyword){
      str.push(keyword);
    });

    return str.join(" ");
  };

  return Column;

});