Autowire = require("autowire");
Autowire.addImportPath("./lib/types");
Autowire.alias("_", "lodash");

module.exports = Autowire(function(Table, Column, Type, ForeignKey, InitTypes) {

  return {
    Table: Table,
    Column: Column,
    Type: Type,
    ForeignKey: ForeignKey
  }

});