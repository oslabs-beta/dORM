import { Dorm } from '../lib/query-builder.ts';
import { assertEquals, assertNotEquals} from "../deps.ts";
import { config } from '../deps.ts';

/*
*@join
*Testing for JOIN method 
*Single table join inserting
*Multiple table joins inserting
*
*/

/*----------------- CONNECTING TO THE DATABASE -----------------*/

const env = config();

// create .env file and add your database inside it. using followin variables USERNAME, PASSWORD, SERVER

const URL = `postgres://${env.USERNAME}:${env.PASSWORD}@${env.SERVER}.db.elephantsql.com:5432/${env.USERNAME}`;

const database = URL; // Or you can add your url here
const dorm = new Dorm(database);

/*------------ TESTING INSERT METHOD ------------*/

/* -------------------------------------------------------------------------- */
/*                            TWO TABLE JOIN METHOD                           */
/* -------------------------------------------------------------------------- */

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

const fromRaw = await dorm.rawrr(`SELECT * FROM people LEFT OUTER JOIN people_in_films ON people._id = people_in_films.person_id`);


Deno.test(`Query completion for single Join in JOIN method:`,  () => {
  assertEquals(Array.isArray(fromTry.rows), true , 'JOIN query is not completed')
});

Deno.test(`dORM query vs raw query for single Join in JOIN method:`,  () => {
  assertEquals(fromRaw.rows, fromTry.rows, 'JOIN query and RAW query should be equal.')
});

/* -------------------------------------------------------------------------- */
/*                         MULTIPLE TABLE JOINS METHOD                        */
/* -------------------------------------------------------------------------- */

const multiJoinQuery1: any = await dorm
.select()
.from('people')
.leftJoin('films')
.on('people._id = people_in_films.person_id')
.leftJoin('films')
.on('people_in_films.film_id = films._id')
.then((data:any)=> {
  return data.rows;
})
.catch ((err) => {
  console.log('Error:', err)
})
const fromRaw2 = await dorm.rawrr(`SELECT * FROM people LEFT OUTER JOIN "people_in_films" ON people._id = "people_in_films".person_id LEFT OUTER JOIN films ON "people_in_films".film_id = films._id`);

// console.log('fromRaw2: ', fromRaw2.rows[fromRaw2.rows.length-1]);


Deno.test(`Query completion for two Joins in JOIN method:`,  () => {
  assertEquals(Array.isArray(multiJoinQuery1), true , 'JOIN query is not completed')
});

Deno.test(`dORM query vs raw query for two Joins in JOIN method:`,  () => {
  assertEquals(fromRaw2.rows, multiJoinQuery1, 'JOIN query and RAW query should be equal.')
});

/* -------------------------------------------------------------------------- */
/*                          FLEXIBLITY OF JOINS TEST                          */
/* -------------------------------------------------------------------------- */

const multiJoinQuery2: any = dorm
.select()
.leftJoin('films')
.join('people_in_films')
.from('people')
.on('people._id = people_in_films.person_id')
.on('people_in_films.film_id = films._id')
.then((data:any)=> {
  return data.rows;
})
.catch ((err) => {
  console.log('Error:', err)
})

// console.log('multiJoinQuery2: ', multiJoinQuery2.info);



const fromRaw3 = await dorm.rawrr(`SELECT * FROM people LEFT OUTER JOIN "people_in_films" ON people._id = "people_in_films".person_id LEFT OUTER JOIN films ON "people_in_films".film_id = films._id`);

// console.log('fromRaw2: ', fromRaw3.rows[fromRaw2.rows.length-1]);


Deno.test(`Query completion for two Joins in JOIN method:`,  () => {
  assertEquals(Array.isArray(multiJoinQuery2), true , 'JOIN query is not completed')
});

Deno.test(`dORM query vs raw query for two Joins in JOIN method:`,  () => {
  assertEquals(fromRaw2.rows, multiJoinQuery2, 'JOIN query and RAW query should be equal.')
});


/* -------------------------------------------------------------------------- */
/*                                 WITHOUT ON                                 */
/* -------------------------------------------------------------------------- */

const multiJoinQuery3: any = await dorm
.select()
.from('people')
.join('people_in_films')
.then((data:any)=> {
  return data;
})
.catch ((err) => {
  console.log('Error:', err)
})

Deno.test(`Query cannot complete without "ON" condition for two Joins in JOIN method:`,  () => {
  assertEquals(multiJoinQuery3, undefined , 'JOIN query is not completed')
});

/* -------------------------------------------------------------------------- */
/*               CANNOT SPECIFY ON BEFORE JOIN METHOD IS CALLED               */
/* -------------------------------------------------------------------------- */

const multiJoinQuery4: any = await dorm
.select()
.from('people')
.on('people._id = people_in_films.person_id')
.join('people_in_films')
.leftJoin('films')
.on('people_in_films.film_id = films._id')
.then((data:any)=> {
  return data;
})
.catch ((err) => {
  console.log('Error:', err)
});

Deno.test(`Query cannot complete without "ON" condition for two Joins in JOIN method:`,  () => {
  assertEquals(multiJoinQuery4, undefined, 'JOIN query is not completed')
});