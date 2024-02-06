drop table "user";

CREATE TABLE "user" (
    "id" bpchar(25) PRIMARY KEY NOT NULL,
    "username" varchar(255),
    "password" varchar(255) ,
    "create_at" timestamp DEFAULT (now())
);
