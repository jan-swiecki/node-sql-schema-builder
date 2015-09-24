module.exports = Autowire(function(_, util){

  function Column(name, type) {
    if(this instanceof Column) {
      this.name = name;
      this.type = type;
    } else {
      return new Column(name, type);
    }
  }

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

  Column.prototype.toSql = function() {
    return "\"" + this.name + "\" " + this.type.toSql();
  }

});