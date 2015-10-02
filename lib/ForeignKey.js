module.exports = Autowire(function(_) {
  function ForeignKey(column, referenceTable, referenceColumn) {
    if(this instanceof ForeignKey) {
      this.isFetchColumn = _.isString(column);
      this.column = column;
      this.referenceTable = referenceTable;

      if(_.isString(referenceColumn)) {
        this.referenceColumn = referenceTable.getColumnByName(referenceColumn);
      } else {
        this.referenceColumn = referenceColumn;
      }

    } else {
      return new ForeignKey(column, referenceTable, referenceColumn);
    }
  }

  ForeignKey.prototype.setTable = function(table) {
    this.table = table;
    return this;
  };

  ForeignKey.prototype.getTable = function(table) {
    return this.table;
  };

  ForeignKey.prototype.toSql = function() {
    var self = this;

    if(this.isFetchColumn) {
      if(! this.table) {
        throw new Error("table must be set");
      }
      this.column = this.table.getColumnByName(this.column);
    }

    var str = [];

    str.push("FOREIGN KEY (\""+this.column.name+"\") REFERENCES \""+this.referenceTable.name+"\" (\""+this.referenceColumn.name+"\")");

    return str.join(" ");
  };

  return ForeignKey;
});