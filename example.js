var Builder = require("./index");

var Table = Builder.Table;
var Column = Builder.Column;
var ForeignKey = Builder.ForeignKey;
var Type = Builder.Type;

// build
var Group = Table("Group").add(
  Column("id", Type.UUID.primaryKey()),
  Column("name", Type.VARCHAR(64).notNull())
);

var User = Table("User").add(
  Column("id", Type.UUID.primaryKey()),
  Column("name", Type.VARCHAR(64).notNull()),
  Column("about", Type.JSON.notNull())
    .default({"info": "", "bulletPoints": []}),
  Column("emails", Type.JSON.notNull())
    .default([]),
  Column("createdAt", Type.TIMESTAMPTZ.notNull()),
  Column("modifiedAt", Type.TIMESTAMPTZ.notNull()),
  Column("group", Type.UUID),
  ForeignKey("group", Group, "id")
);

// stringify
console.log(Group.toSql());
console.log(User.toSql());

