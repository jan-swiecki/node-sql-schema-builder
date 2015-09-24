Autowire = require("autowire");
Autowire.addImportPath("./lib/types");
Autowire.alias("_", "lodash");

Autowire(function(_, Table, Column, Type, ForeignKey, InitTypes) {

  var company = Table("company").addColumns(
    Column("id", Type.UUID.primaryKey()),
    Column("name", Type.VARCHAR(64).notNull())
  );

  var user = Table("user").addColumns(
    Column("id", Type.UUID.primaryKey()),
    Column("email", Type.VARCHAR(64).notNull()),
    Column("password", Type.VARCHAR(255).notNull())
  ).addForeignKeys(
    ForeignKey("company", company, "id")
  );

  var sql = user.toSql();

  console.log(sql);

});