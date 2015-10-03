# SQL Schema Builder (alpha)

Currently only PostgreSQL supported.

# Installation

    npm install sql-schema-builder

# Usage

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

Will output:

    CREATE TABLE "Group" (
        "id" UUID PRIMARY KEY,
        "name" VARCHAR(64) NOT NULL
    );
    CREATE TABLE "User" (
        "id" UUID PRIMARY KEY,
        "name" VARCHAR(64) NOT NULL,
        "about" JSON NOT NULL DEFAULT '{"info":"","bulletPoints":[]}',
        "emails" JSON NOT NULL DEFAULT '[]',
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "modifiedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "group" UUID,
        FOREIGN KEY ("group") REFERENCES "Group" ("id")
    );