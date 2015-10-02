Autowire = require("autowire");
Autowire.addImportPath("./lib/types");
Autowire.alias("_", "lodash");

Autowire(function(_, Table, Column, Type, ForeignKey, InitTypes) {

  //var company = Table("company").add(
  //  Column("id", Type.UUID.primaryKey()),
  //  Column("name", Type.VARCHAR(64).notNull())
  //);
  //
  //var user = Table("user").add(
  //  Column("id", Type.UUID.primaryKey()),
  //  Column("email", Type.VARCHAR(64).notNull()),
  //  Column("password", Type.VARCHAR(255).notNull()),
  //  ForeignKey("company", company, "id")
  //);

  var company = Table("company").add(
    Column("id", Type.UUID.primaryKey()),
    Column("name", Type.VARCHAR(64).notNull()),
    Column("about", Type.JSON.notNull())
      .default({"info": "", "bulletPoints": []}),
    Column("emails", Type.JSON.notNull())
      .default([]),
    Column("createdAt", Type.TIMESTAMPTZ.notNull()),
    Column("modifiedAt", Type.TIMESTAMPTZ.notNull())
  );

  //"about" json not null default '{"info": "", "bulletPoints": []}'::json,
  //"emails" json not null default '[]'::json,


  var user = Table("user").add(
    Column("id", Type.UUID.primaryKey()),
    Column("email", Type.VARCHAR(64).notNull()),
    Column("password", Type.VARCHAR(255).notNull())
  );

  var user_company_member = getGraphDbRelation(user, company, "member", "companyMember");

  var userSql = user.toSql();
  var companySql = company.toSql();
  var userCompanyMemberSql = user_company_member.toSql();

  console.log(userSql);
  console.log(companySql);
  console.log(userCompanyMemberSql);

  function getGraphDbRelation(fromTable, toTable, name, reverseName) {
    return Table(fromTable.name+"_"+toTable.name+"_"+name).add(
      Column("id", Type.UUID.primaryKey()),
      Column(name, Type.UUID),
      Column(reverseName, Type.UUID),
      ForeignKey(name, fromTable, "id"),
      ForeignKey(reverseName, toTable, "id")
    );
  }

});