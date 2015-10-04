Autowire = require("autowire");
Autowire.addImportPath("./lib/types");
Autowire.addImportPath("./lib/validator");
Autowire.alias("_", "lodash");
Autowire.alias("Promise", "bluebird");

module.exports = Autowire(function(Table, Column, Type, ForeignKey, InitTypes) {

  return {
    Table: Table,
    Column: Column,
    Type: Type,
    ForeignKey: ForeignKey
  }

});

Autowire.wire("Builder", module.exports);