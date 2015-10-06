var Autowire = require("./autowire");

module.exports = Autowire(function(Table, Column, Type, ForeignKey,
                                   InitTypes, FieldValidator, EntityValidator,
                                   ORMGenerator) {

  return {
    Table: Table,
    Column: Column,
    Type: Type,
    ForeignKey: ForeignKey,
    FieldValidator: FieldValidator,
    EntityValidator: EntityValidator,
    ORMGenerator: ORMGenerator
  }

});

Autowire.wire("Builder", module.exports);