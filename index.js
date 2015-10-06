var Autowire = require("./autowire");

module.exports = Autowire(function(Table, Column, Type, ForeignKey,
                                   InitTypes, FieldValidator, EntityValidator,
                                   ORMGenerator, TimestampHelper) {

  return {
    Table: Table,
    Column: Column,
    Type: Type,
    ForeignKey: ForeignKey,
    FieldValidator: FieldValidator,
    EntityValidator: EntityValidator,
    ORMGenerator: ORMGenerator,
    TimestampHelper: TimestampHelper
  }

});

Autowire.wire("Builder", module.exports);