var Builder = require("../index");
var fs = require("fs");
var assert = require("assert");

var currentDir = require("path").parse(module.id).dir;

describe("Schema builder", function(){

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

  it('should generate proper User sql', function(){
    assert.strictEqual(User.toSql(), fs.readFileSync(currentDir+"/user.sql", "utf8"));
  });
  it('should generate proper Group sql', function(){
    assert.strictEqual(Group.toSql(), fs.readFileSync(currentDir+"/group.sql", "utf8"));
  });
});

