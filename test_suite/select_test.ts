import { Dorm } from '../lib/draft.ts';
import { assertEquals, assertNotEquals} from "../deps.ts";
import { config } from '../deps.ts';

/*
* @select
* Invalid 
* Testing for SELECT method 
* Single column selecting
* Multiple columns selecting
* Edge cases: 
  * calling multiple actions/methods
*/

/*-------- CONNECTING TO THE DATABASE --------*/

const env = config();
// create .env file and add your database inside it. using followin variables USERNAME, PASSWORD, SERVER
const URL = `postgres://${env.USERNAME}:${env.PASSWORD}@${env.SERVER}.db.elephantsql.com:5432/${env.USERNAME}`;

const database = URL; // Or you can add your url here
const dorm = new Dorm(database);


/*------------ CREATING TESTING ID------------*/
var updateId = Math.floor(Math.random()*35);

/* -------------------------------------------------------------------------- */
/*                            QUERY VALIDATION TEST                           */
/* -------------------------------------------------------------------------- */

const selectQuery = await dorm
.select()
.from('people')
.where('_id=1')
.then((data: any) => {
  return data.rows;
})
.catch((e)=> {throw e})
console.log('selectQuery :', selectQuery)


Deno.test(`connection to the database:`, () => {
  assertEquals(Array.isArray(selectQuery), true, 'connect should be returning a query.');
});


Deno.test(`"SELECT" method:`, () => {
  assertEquals(Array.isArray(selectQuery), true, `Error:the method should return a query result.`);
});

/* -------------------------------------------------------------------------- */
/*                       MULTIPLE ACTION VALIDATION TEST                      */
/* -------------------------------------------------------------------------- */

const invalidSelect = await dorm
.select()
.from('people')
.delete()
.where('_id=1')
.then((data: any) => {
  return data.rows;
}).catch((e)=> {return e})

Deno.test(`all queries to be valid in "SELECT" method:`,() => {
  assertEquals(invalidSelect, 'No multiple actions', `Error:INVALID query found!!!! It should  return an error for invalid query request from Postgres.`) 
})

/* -------------------------------------------------------------------------- */
/*                             SINGLE COLUMN QUERY                            */
/* -------------------------------------------------------------------------- */

Deno.test(`single-column query in "SELECT" method:`, () => {
  const tableName = 'userprofile';
  const condition = 'user_id = 2'
  
  const test = dorm.select().from('userprofile').where('user_id = 2');
  assertEquals(test.info.action.type , 'SELECT', `Error:type is not updated to SELECT`);
  assertEquals(test.info.action.columns , '*', `Error:column/columns are updated to *`);
  assertEquals(test.info.action.table , tableName, `Error:table is not updated to ${tableName}`);
  assertEquals(test.info.filter.where , true, `Error:where is not updated to true`);
  assertEquals(test.info.filter.condition ,condition, `Error:condition is not updated to ${condition}`);

/* ------------------------ RESETTING INITIAL VALUES ------------------------ */

  const testQuery = test.toString();

  assertEquals(testQuery , `SELECT * FROM userprofile WHERE user_id = 2`, 'Error:Querybuilder is returning INVALID query string!!');
  assertEquals(test.info.action.type , null, 'Error:Type is not reset after query');
  assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset after query');
  assertEquals(test.info.action.table , null, 'Error:Table is not reset after query');
  assertEquals(test.info.filter.where , false, `Error:where is not reset after query`);
  assertEquals(test.info.filter.condition , null, `Error:condition is not reset after query`);
})

/* -------------------------------------------------------------------------- */
/*                         MULTIPLE COLUMNS QUERY TEST                        */
/* -------------------------------------------------------------------------- */

Deno.test(`multiple-columns query in "SELECT" method:`,   () => {
  const columnName = 'username, email';
  const tableName = 'userprofile';
  const condition = 'user_id = 1'

  const test =  dorm.select(columnName).from(tableName).where(condition);
  assertEquals(test.info.action.type , 'SELECT', 'Error:Type is not updated to SELECT');
  assertEquals(test.info.action.columns , columnName, `Error:column/columns are updated to ${columnName}`);
  assertEquals(test.info.action.table , tableName, `Error:table is not updated to ${tableName}`);
  assertEquals(test.info.filter.where , true, `Error:where is not updated to true`);
  assertEquals(test.info.filter.condition , `${condition}`, `Error:condition is not updated to ${condition}`);
  
/* ------------------------ RESETTING INITIAL VALUES ------------------------ */

  const testQuery = test.toString();

  assertEquals(testQuery , `SELECT username, email FROM userprofile WHERE user_id = 1`, 'Error:Querybuilder is returning INVALID query string!!');
  assertEquals(test.info.action.type , null, 'Error:Type is not reset after query');
  assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset');
  assertEquals(test.info.action.table , null, 'Error:Table is not reset after query');
  assertEquals(test.info.filter.where , false, `Error:where is not reset after query`);
  assertEquals(test.info.filter.condition , null, `Error:condition is not reset after query`);
})
