module.exports = Autowire(function(_) {
  function ForeignKey(name, referenceTable, referenceColumn) {
    if(this instanceof ForeignKey) {
      this.name = name;
      this.referenceTable = referenceTable;

      if(_.isString(referenceColumn)) {
        this.referenceColumn = referenceTable.getColumnByName(referenceColumn);
      } else {
        this.referenceColumn = referenceColumn;
      }

    } else {
      return new ForeignKey(name, referenceTable, referenceColumn);
    }
  }

  ForeignKey.prototype.toSql = function() {
    var self = this;

    var str = [];

    str.push("FOREIGN KEY (\""+this.name+"\") REFERENCES \""+this.referenceTable.name+"\" (\""+this.referenceColumn.name+"\")");

    return str.join(" ");
  };

  return ForeignKey;
});