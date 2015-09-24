module.exports = Autowire(function(_){

  function Table(options) {
    if(this instanceof Table) {
      this.name = options;
      this.columns = [];
      this.foreignKeys = [];
    } else {
      return new Table(options);
    }
  }

  Table.prototype.setName = function(name) {
    this.name = name;
    return this;
  };

  Table.prototype.getName = function(name) {
    return this.name;
  };

  Table.prototype.addColumn = function(column) {
    this.columns.push(column);
    return this;
  };

  Table.prototype.addColumns = function(columns) {
    var self = this;
    _.each(arguments, function(column) {
      self.columns.push(column);
    });
    return this;
  };

  Table.prototype.addForeignKeys = function(foreignKeys) {
    var self = this;
    _.each(arguments, function(foreignKey){
      self.foreignKeys.push(foreignKey);
    });
    return self;
  };

  Table.prototype.getColumnByName = function(name) {
    var self = this;
    var column = _.find(self.columns, function(column) {
      return column.name === name;
    });
    if(! column) {
      throw new Error("Column not found \""+name+"\"");
    }
    return column;
  };

  Table.prototype.toSql = function() {

    var str = [];

    str.push("CREATE TABLE \""+this.name+"\" (");

    var lines = [];
    _.each(this.columns, function(column) {
      lines.push("    "+column.toSql());
    });
    str.push(lines.join(",\n"));

    str.push(");");

    return str.join("\n");
  };

  return Table;

});