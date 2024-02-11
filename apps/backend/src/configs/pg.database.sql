drop table "user";
drop table "note";

CREATE TABLE "user" (
    "id" bpchar(21) PRIMARY KEY NOT NULL,
    "username" varchar(255),
    "password" varchar(255) ,
    "create_at" timestamp DEFAULT (now())
);

CREATE TABLE "note" (
    "id" bpchar(21) PRIMARY KEY NOT NULL,
    "user_id" bpchar(21) NOT NULL,
    "content" json,
    "create_at" timestamp DEFAULT (now()),
    "updated_at" timestamp DEFAULT (now())
);

CREATE UNIQUE INDEX ON "note" ("user_id");
CREATE UNIQUE INDEX ON "note" ("updated_at");