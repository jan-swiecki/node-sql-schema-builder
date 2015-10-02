module.exports = Autowire(function(_, Column, ForeignKey){

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

  Table.prototype.add = function() {
    var self = this;
    _.each(arguments, function(element) {
      if(element instanceof Column) {
        self.columns.push(element);
      } else if(element instanceof ForeignKey) {
        element.setTable(self);
        self.foreignKeys.push(element);
      } else {
        throw new Error("Unknown type of element \""+element+"\"");
      }
    });
    return this;
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

    var elements = [];
    _.each(this.columns, function(column) {
      elements.push("    "+column.toSql());
    });
    _.each(this.foreignKeys, function(foreignKey) {
      elements.push("    "+foreignKey.toSql());
    });
    str.push(elements.join(",\n"));

    str.push(");");

    return str.join("\n");
  };

  return Table;

});