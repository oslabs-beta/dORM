CREATE TABLE userprofile
(
  "user_id" serial PRIMARY KEY,
  "username" VARCHAR ( 50 ) NULL,
  "password" VARCHAR ( 50 ) NULL,
  "email" VARCHAR ( 255 ) NULL,
  "created_on" TIMESTAMP NULL,
  "last_login" TIMESTAMP
);

CREATE TABLE post
(
  "post_id" serial PRIMARY KEY,
  "posts" VARCHAR ( 250 ) NULL,
  "comments" VARCHAR (100 ) NULL,
  "likes" INT CHECK ( "likes" >= 0),
  "created_on" TIMESTAMP NULL,
  "last_update" TIMESTAMP ,
  "user_id" INT NOT NULL,
  FOREIGN KEY ("user_id")
    REFERENCES "userprofile" (user_id)
);

CREATE TABLE users
(
  "user_id" serial PRIMARY KEY,
  "username" VARCHAR ( 50 ) NULL,
  "country" VARCHAR ( 50 ) NULL,
  "nickname" VARCHAR ( 50 ) NULL,
  "email" VARCHAR ( 255 ) NULL,
  "created_on" TIMESTAMP NULL,
  "last_login" TIMESTAMP
);


INSERT INTO 
    "userprofile"
  ("username", "password", "email" ,"created_on")
VALUES
  ("Golden_Retreiver", "golDenR", "iamagooddog@dogs.com", NOW()),
  ("Superman", "IamnotHuman", "superman@superman.com", NOW()),
  ("MrBing", "BingbingBing", "chandlerbing@bings.com", NOW()),
  ("Betty", "Cayman Islands", "Tiyana", "betty@islands.com", NOW()),
  ("Hunt", "Comoros", "ibelieveIcanFly", "hunt@comoros.com", NOW()),
  ("Roy", "Greece", "yolo", "roy@yolo.com", NOW());


INSERT INTO 
    "users"
  ("username", "country", "nickname" ,"email","created_on")
VALUES
  ("Golden_Retreiver", "Guinea-Bissau", "golDenR", "iamagooddog@dogs.com", NOW()),
  ("Superman", "Malaysia", "IamnotHuman", "superman@superman.com", NOW()),
  ("MrBing", "Anguilla", "BingbingBing", "chandlerbing@bings.com", NOW());

INSERT INTO 
    "post"
  ("posts", "comments", "likes" , "user_id", "created_on")
VALUES
  ("dORM", "dORM is an amazing deno framework", 100, 1, NOW()),
  ("dorm Members", "Han, Hanji, Myo and Nick", 10, 3, NOW());