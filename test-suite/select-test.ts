import { Dorm } from '../lib/query-builder.ts';
import { assertEquals, assertNotEquals } from '../deps.ts';
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
const URL = `postgres://${env.USERNAME}:${env.PASSWORD}@${env.SERVER}:5432/${env.USERNAME}`;

const database = URL; // Or you can add your url here
const dorm = new Dorm(database);

/*------------ CREATING TESTING ID------------*/
var updateId = 2;

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
.catch((e:any)=> {throw e})
Deno.test(`connection to the database:`, () => {
  assertNotEquals(selectQuery,undefined, 'connect should be returning a query.');
});
Deno.test(`"SELECT" method:`, () => {
  assertNotEquals(selectQuery,undefined, `Error:the method should return a query result.`);
});


/* -------------------------------------------------------------------------- */
/*                       MULTIPLE ACTION VALIDATION TEST                      */
/* -------------------------------------------------------------------------- */

const invalidSelect1 = await dorm
  .select()
  .from('people')
  .delete()
  .where('_id=1')
  .then((data: any) => {
    return data.rows;
  })
  .catch((e) => {
    return e;
  });

Deno.test(`all queries to be valid in "SELECT" method:`, () => {
  assertEquals(
    invalidSelect1,
    'No multiple actions',
    `Error:INVALID query found!!!! It should  return an error for invalid query request from Postgres.`
  );
});

/* -------------------------------------------------------------------------- */
/*                          INVALID QUERY STRING TEST                         */
/* -------------------------------------------------------------------------- */

const invalidSelect = await dorm
.select()
.from('userprofile')
.where('_id=1')
.then((data: any) => {
  return data.rows;
}).catch((e:any)=> {return false})

Deno.test(`all queries to be valid in "SELECT" method:`,() => {
  assertEquals(invalidSelect, false, `Error:INVALID query found!!!! It should  return an error for invalid query request from Postgres.`) 
})

/* -------------------------------------------------------------------------- */
/*                             SINGLE COLUMN QUERY                            */
/* -------------------------------------------------------------------------- */

Deno.test(`single-column query in "SELECT" method:`, () => {
  const tableName = 'userprofile';
  const condition = 'user_id = 2'

  const test = dorm.select().from('userprofile').where('user_id = 2');
  assertEquals(test.info.action.type , 'SELECT', `Error:type is not updated to SELECT`);
  assertEquals(test.info.action.table , tableName, `Error:table is not updated to ${tableName}`);
  assertEquals(test.info.filter.where , true, `Error:where is not updated to true`);
  
  /* ------------------------ RESETTING INITIAL VALUES ------------------------ */
  
  const testQuery = test.toString();
  assertEquals(testQuery , `SELECT * FROM userprofile WHERE user_id = $1`, 'Error:Querybuilder is returning unparametrized query string!!');
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
  assertEquals(test.info.filter.where , true, `Error:where is not updated to true`);

  
  /* ------------------------ RESETTING INITIAL VALUES ------------------------ */
  
  const testQuery = test.toString();
  assertEquals(testQuery , `SELECT username, email FROM userprofile WHERE user_id = $1`, 'Error:Querybuilder is returning unparametrized query string!!');
  assertEquals(test.info.action.type , null, 'Error:Type is not reset after query');
  assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset');
  assertEquals(test.info.action.table , null, 'Error:Table is not reset after query');
  assertEquals(test.info.filter.where , false, `Error:where is not reset after query`);
  assertEquals(test.info.filter.condition , null, `Error:condition is not reset after query`);
})