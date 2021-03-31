-- SET statement_timeout
-- = 0;
-- SET lock_timeout
-- = 0;
-- SET idle_in_transaction_session_timeout
-- = 0;
-- SET client_encoding
-- = 'UTF8';
-- SET standard_conforming_strings
-- = on;
-- SELECT pg_catalog.set_config('search_path', '', false);
-- SET check_function_bodies
-- = false;
-- SET xmloption
-- = content;
-- SET client_min_messages
-- = warning;
-- SET row_security
-- = off;

CREATE TABLE public.userprofile
(
  "user_id" serial PRIMARY KEY,
  "username" VARCHAR ( 50 ) NULL,
  "password" VARCHAR ( 50 ) NULL,
  "email" VARCHAR ( 255 ) NULL,
  "created_on" TIMESTAMP NULL,
  "last_login" TIMESTAMP
)
WITH (
  OIDS=FALSE
);
CREATE TABLE public.post
(
  "post_id" serial PRIMARY KEY,
  "posts" VARCHAR ( 250 ) NULL,
  "comments" VARCHAR (100 ) NULL,
  "likes" INT CHECK ( "likes" >= 0),
  "created_on" TIMESTAMP NULL,
  "last_update" TIMESTAMP
)
WITH (
  OIDS=FALSE
);
CREATE TABLE public.users
(
  "user_id" serial PRIMARY KEY,
  "username" VARCHAR ( 50 ) NULL,
  "country" VARCHAR ( 50 ) NULL,
  "nickname" VARCHAR ( 50 ) NULL,
  "email" VARCHAR ( 255 ) NULL,
  "created_on" TIMESTAMP NULL,
  "last_login" TIMESTAMP
)
WITH (
  OIDS=FALSE
);

CREATE TABLE public.dropthis
(
  "_id" serial PRIMARY KEY,
  "username" VARCHAR ( 150 ) NULL,
  "email" VARCHAR ( 255 ) NULL
)
WITH (OIDS=FALSE);

INSERT INTO 
  userprofile
  (username, password, email ,created_on)
VALUES
  ('Golden_Retreiver', 'golDenR', 'iamagooddog@dogs.com', NOW()),
  ('Superman', 'IamnotHuman', 'superman@superman.com', NOW()),
  ('MrBing', 'BingbingBing', 'chandlerbing@bings.com', NOW()),
  ('Betty', 'Tiyana', 'betty@islands.com', NOW()),
  ('Hunt', 'ibelieveIcanFly', 'hunt@comoros.com', NOW()),
  ('Roy', 'yolo', 'roy@yolo.com', NOW());


INSERT INTO 
    users
  (username, country, nickname ,email,created_on)
VALUES('Golden_Retreiver', 'Guinea-Bissau', 'golDenR', 'iamagooddog@dogs.com', NOW()),
  ('Superman', 'Malaysia', 'IamnotHuman', 'superman@superman.com', NOW()),
  ('MrBing', 'Anguilla', 'BingbingBing', 'chandlerbing@bings.com', NOW());

INSERT INTO 
    post
  (posts, comments, likes , created_on)
VALUES
  ('dORM', 'dORM is an amazing deno framework', 100, NOW()),
  ('dorm Members', 'Han, Hanji, Myo and Nick', 10, NOW());