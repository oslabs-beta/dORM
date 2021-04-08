import { Dorm } from '../lib/draft.ts';
import { assertEquals, assertNotEquals} from "../deps.ts";
import {url} from './test_url.ts'

/*
*@join
*Testing for JOIN method 
*Single table join inserting
*Multiple table joins inserting
*
*/

/*----------------- CONNECTING TO THE DATABASE -----------------*/
// const database = url; 
const starwars = 'postgres://zydvrcsl:f7csg8Xbd1Zmd0ya60mINQ9mkMt-G3Da@queenie.db.elephantsql.com:5432/zydvrcsl'
// psql -d postgres://zydvrcsl:f7csg8Xbd1Zmd0ya60mINQ9mkMt-G3Da@queenie.db.elephantsql.com:5432/zydvrcsl -f ./test_suite/db_test_starwars_create.sql
const dorm = new Dorm(starwars);

/*------------ TESTING INSERT METHOD ------------*/

const expectedQuery1 = `SELECT * FROM people LEFT OUTER JOIN people_in_films ON people._id = people_in_films.person_id`;

const expectedQuery2 = `SELECT "people"."_id", "people"."name", "people"."mass", "people"."hair_color", "people"."skin_color", "people"."eye_color", "people"."birth_year", "people"."gender", "people"."species_id", "people"."homeworld_id", "people"."height", "people_in_films"."_id" AS "people_in_films._id", "people_in_films"."person_id" AS "people_in_films.person_id", "people_in_films"."film_id" AS "people_in_films.film_id", "people_in_films->film"."_id" AS "people_in_films.film._id", "people_in_films->film"."title" AS "people_in_films.film.title", "people_in_films->film"."episode_id" AS "people_in_films.film.episode_id", "people_in_films->film"."opening_crawl" AS "people_in_films.film.opening_crawl", "people_in_films->film"."director" AS "people_in_films.film.director", "people_in_films->film"."producer" AS "people_in_films.film.producer", "people_in_films->film"."release_date" AS "people_in_films.film.release_date" FROM "public"."people" AS "people" LEFT OUTER JOIN "public"."people_in_films" AS "people_in_films" ON "people"."_id" = "people_in_films"."person_id" LEFT OUTER JOIN "public"."films" AS "people_in_films->film" ON "people_in_films"."film_id" = "people_in_films->film"."_id"`;


let fromTry:any;
try{
  fromTry = await dorm
  .select()
  .from('people')
  .join('people_in_films')
  .on('people._id = people_in_films.person_id');
}
catch(err){
  console.log('Error:', err);
}
// console.log('fromTry: ', fromTry.rows[0])
// QUERY COMPLETED BUT THE RETURNING DATA IS NOT EQUAL

const fromRaw = await dorm.rawrr(`SELECT * FROM people LEFT OUTER JOIN people_in_films ON people._id = people_in_films.person_id`);
// console.log('fromRaw: ', fromRaw.rows[0])

Deno.test(`Query completion for single Join in JOIN method:`,  () => {
  assertEquals(Array.isArray(fromTry.rows), true , 'JOIN query is not completed')
});

Deno.test(`dORM query vs raw query for single Join in JOIN method:`,  () => {
  assertEquals(fromRaw.rows, fromTry.rows, 'JOIN query and RAW query should be equal.')
});

const multiJoinQuery1: any = await dorm
.select()
.from('people')
.join('people_in_films')
.on('people._id = people_in_films.person_id')
.join('films')
.on('people_in_films.film_id = films._id')
.then((data:any)=> {
  return data.rows;
})
.catch ((err) => {
  console.log('Error:', err)
})
console.log('multiJoinQuery1: ', multiJoinQuery1[0])

const fromRaw2 = await dorm.rawrr(`SELECT * FROM people LEFT OUTER JOIN "people_in_films" ON people._id = "people_in_films".person_id LEFT OUTER JOIN films ON "people_in_films".film_id = films._id`);

console.log('fromRaw2: ', fromRaw2.rows[0])


Deno.test(`Query completion for two Joins in JOIN method:`,  () => {
  assertEquals(Array.isArray(multiJoinQuery1), true , 'JOIN query is not completed')
});

Deno.test(`dORM query vs raw query for two Joins in JOIN method:`,  () => {
  assertEquals(fromRaw2.rows, multiJoinQuery1, 'JOIN query and RAW query should be equal.')
});

/*
fromTry:  {
  _id: 1,
  name: "Luke Skywalker",
  mass: "77",
  hair_color: "blond",
  skin_color: "fair",
  eye_color: "blue",
  birth_year: "19BBY",
  gender: "male",
  species_id: 1,
  homeworld_id: 1,
  height: 172
} 
fromRaw:  {
  _id: 1,
  name: "Luke Skywalker",
  mass: "77",
  hair_color: "blond",
  skin_color: "fair",
  eye_color: "blue",
  birth_year: "19BBY",
  gender: "male",
  species_id: 1,
  homeworld_id: 1,
  height: 172,
  person_id: 1,
  film_id: 1
}


*/