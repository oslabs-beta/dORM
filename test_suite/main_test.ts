import { Dorm } from '../lib/draft.ts';
import { assertEquals, assertNotEquals} from "../deps.ts";
import {url} from './test_url.ts'

/*----------------- TESTING SCOPE -----------------*/


/*
 * @basic_cases {Query Completion, Data update,}
 * @edge_cases {Invalid strings, multiple methods, postgre error return, error handling}
 */
const database = url;
const dorm = new Dorm(database);

// console.log(dorm);
/*------------ CREATING TESTING ID------------*/
var updateId = Math.floor(Math.random()*35);








/*------------ TESTING DROP METHOD ------------*/

// // PSQL create table queries
// const pageQuery = `CREATE TABLE pages (
// 	page_id serial PRIMARY KEY,
// 	title VARCHAR (255) NOT NULL,
// 	contents TEXT,
// 	author_id INT NOT NULL,
// 	FOREIGN KEY (author_id) 
//           REFERENCES authors (author_id)
// )`;
// const noteQuery = `CREATE TABLE notes (
// 	page_id serial PRIMARY KEY,
// 	title VARCHAR (255) NOT NULL,
// 	contents TEXT,
// 	author_id INT NOT NULL,
// 	FOREIGN KEY (author_id) 
//           REFERENCES authors (author_id)
// )`;
// // creating a single table
// const createPages1 = await query(pageQuery)
// // const dropQuery = await dorm.drop().table('pages').then(data => data).catch(e => e);
// const findPages1 = await dorm.select().table('pages').then(data=> console.log(data)).catch(error => false);

// // creating multiple tables
// // const createPages2 = await query(pageQuery);
// // const createNotes = await query(noteQuery)
// // const dropQuery2 = await dorm.drop().table('pages', 'nots').then(data => data).catch(e => e);
// // const findNotes = await dorm.select().table('notes').then(data=> data).catch(error => false);
// // const findPages2 = await dorm.select().table('pages').then(data=> data).catch(error => false);
// Deno.test(`Is "DROP" method working for droping table or tables`, ()=> {
//   assertEquals(findPages1,false,`The "DROP" method is not working for dropping a single table`)
//   // assertEquals((findPages2 === findNotes),true,`The "DROP" method is not working for dropping a single table`)

// })