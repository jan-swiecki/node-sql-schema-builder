Autowire = require("autowire");
Autowire.addImportPath("./lib/types");

Autowire(function(_, Table, Column, Type) {

  var table = Table("user").addColumns(
    Column("id", Type.UUID.primaryKey()),
    Column("email", Type.VARCHAR(64).notNull()),
    Column("password", Type.VARCHAR(255).notNull())
  );

  var sql = table.toSql();

  console.log(sql);

});