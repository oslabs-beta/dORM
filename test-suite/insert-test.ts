import { Dorm } from '../lib/query-builder.ts';
import { assertEquals, assertNotEquals } from '../deps.ts';
import { config } from '../deps.ts';

/*
 *@insert
 *Invalid
 *Testing for INSERT method
 *Single row inserting
 *Multiple rows inserting
 */

/*----------------- CONNECTING TO THE DATABASE -----------------*/

const env = config();
// create .env file and add your database inside it. using followin variables USERNAME, PASSWORD, SERVER
const URL = `postgres://${env.USERNAME}:${env.PASSWORD}@${env.SERVER}:5432/${env.USERNAME}`;

const database = URL; // Or you can add your url here
const dorm = new Dorm(database);

/*------------ CREATING TESTING ID------------*/
var updateId = 2;


const insertQuery = await dorm
.insert([{'username':'newDogs', 'email': 'newdog@dog.com' }])
.table('dropthis')
.returning()
.then((data: any) => {
  return data;
})
const insertSelectQuery1 = await dorm
.select()
.table('dropthis')
.then((data: any) => {
  return data.rows;
})

/* -------------------------------------------------------------------------- */
/*                         VALIDATION OF INSERT METHOD                        */
/* -------------------------------------------------------------------------- */

Deno.test(`all queries to be valid in "INSERT" method:`, () => {
  assertNotEquals(insertQuery, undefined, 'Error:the method should return a query result.')
  assertNotEquals(insertQuery, insertSelectQuery1, `Expected value: ${insertQuery} not to be equal to Received:${insertSelectQuery1}`)
});

const invalidInsert = await dorm
.insert([{'user':'newDogs'}])
.delete('dropthis')
.table('dropthis')
.where('_id=1')
.then((data: any) => {
  return data.rows;
}).catch((e:any)=> {return e})

Deno.test(`all invalid queries should not work in "INSERT" method:`,() => {
  assertEquals(invalidInsert, 'No multiple actions', `Error:INVALID query found!!!! It should  return an error for invalid query request from Postgres.`)
})

/* -------------------------------------------------------------------------- */
/*                      SINGLE ROW QUERY IN INSERT METHOD                     */
/* -------------------------------------------------------------------------- */
Deno.test(`single-row query in "INSERT" method:`,  () => {
  const columnName = [{'username':'singleLady'}];
  const tableName = 'users';
  const returning = '*'
  const test = dorm
  .insert(columnName)
  .from(`${tableName}`)
  .returning(returning);
  assertEquals(test.info.action.type , 'INSERT', `Error:type is not updated to SELECT`);
  assertEquals(test.info.action.table , tableName, `Error:table is not updated to ${tableName}`);
  
  /* ------------------------ RESETTING INITIAL VALUES ------------------------ */
  const testQuery = test.toString();
  assertEquals(testQuery , `INSERT INTO users (username) VALUES ($1) RETURNING *`, 'Error:Querybuilder is returning unparametrized query string!!');
  assertEquals(test.info.action.type , null, 'Error:Type is not reset after query');
  assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset after query');
  assertEquals(test.info.action.table , null, 'Error:Table is not reset after query');
  assertEquals(test.info.action.values , [], 'Error:Value is not reset after query');
});

/* -------------------------------------------------------------------------- */
/*                    MULTIPLE ROWS QUERY IN INSERT METHOD                    */
/* -------------------------------------------------------------------------- */
Deno.test(`multiple-rows query in "INSERT" method:`,  () => {
  const columnNames = [
    {
      'username':'Golden_Retreiver',
      'password': 'golDenR',
      'email':'iamagooddog@dogs.com',
      'created_on': 'NOW()'
    },
    {
      'username':'Superman',
      'password':'IamnotHuman',
      'email':'superman@superman.com',
      'created_on': 'NOW()'
    },
    {
      'username':'MrBing',
      'password':'BingbingBing',
      'email':'chandlerbing@bings.com',
      'created_on': 'NOW()'
    }
  ];
  const tableName = 'userprofile';
  const test = dorm
  .insert(columnNames)
  .table(tableName)
  assertEquals(test.info.action.type , 'INSERT', 'Type is not updated to INSERT');
  assertEquals(test.info.action.table , tableName, `Error:table is not updated to ${tableName}`);
  
  /* ------------------------ RESETTING INITIAL VALUES ------------------------ */

  test.toString();
  assertEquals(test.info.action.type , null, 'Error:Type is not reset after query');
  assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset after query');
  assertEquals(test.info.action.table , null, 'Error:Table is not reset after query');
  assertEquals(test.info.action.values , [], 'Error:Value is not reset after query');
});