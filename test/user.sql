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