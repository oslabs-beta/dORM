import { Dorm } from '../lib/draft.ts';
import { assertEquals, assertNotEquals} from "../deps.ts";
import { config } from '../deps.ts';

/*
*@select
*Invalid 
*Testing for UPDATE method 
*Single row updating
*Multiple rows updating
*All rows updating (the whole table update)
*/

/*-------- CONNECTING TO THE DATABASE --------*/

const env = config();
// create .env file and add your database inside it. using followin variables USERNAME, PASSWORD, SERVER
const URL = `postgres://${env.USERNAME}:${env.PASSWORD}@${env.SERVER}.db.elephantsql.com:5432/${env.USERNAME}`;

const database = URL; // Or you can add your url here
const dorm = new Dorm(database);


/*------------ CREATING TESTING ID------------*/
var updateId = Math.floor(Math.random()*3);


const updateQuery = await dorm
.update({'username':'updatedDogs', 'email': 'updated@dogs.com'})
.where(`_id = ${updateId}`)
.table('dropthis')
.returning()
.then((data: any) => {
  return data.rows;
}).catch(e => e);
console.log('1:',updateQuery)

const testUpdateQuery1 = await dorm
.select()
.table('dropthis')
.where(`_id=${updateId}`)
.then((data: any) => {
  
  return data.rows;
}).catch(e => e);
console.log('2:',testUpdateQuery1)  

/* -------------------------------------------------------------------------- */
/*                      SINGLE ROW QUERY IN UPDATE METHOD                     */
/* -------------------------------------------------------------------------- */

Deno.test(`a single-row query in "UPDATE" method:`, () => {
  const test = dorm.update({'username':'newDogs', 'password': 'iLoveDogs'}).where(`user_id = ${updateId+1}`)
  .from('userprofile')  
  .returning('username')
  assertEquals(updateQuery, testUpdateQuery1 , 'Error: the method should work more than one row');
  assertEquals(test.info.action.type , 'UPDATE', 'Error:Type is not updated to UPDATE');
  assertEquals(test.info.action.columns , `username = 'newDogs', password = 'iLoveDogs'`, `Error:Columns are not updated to username = 'newDogs', password = 'iLoveDogs'`);
  
  
  assertEquals(test.info.action.table , 'userprofile', 'Error:Table is not updated to userprofile');
  assertEquals(test.info.returning.active , true, 'Error:Returning is not updated');  
  assertEquals(test.info.returning.columns , 'username', 'Error:Columns in Returning is not reset');
  
  /* ------------------------ RESETTING INITIAL VALUES ------------------------ */
  
  test.toString();
  assertEquals(test.info.action.type , null, 'Error:Type is not reset');
  assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset');
  assertEquals(test.info.action.values , '', 'Error:Values are not reset');
  assertEquals(test.info.action.table , null, 'Error:Table is not reset');
  assertEquals(test.info.returning.active , false, 'Error:Returning is not reset');  
  assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning is not reset');
  
});


const testUpdateQuery2 = await dorm
.select()
.table('userprofile')
.where(`user_id <= ${updateId}`)
.then((data: any) => {
  return data.rows;
}).catch(e => e);

const multipleRowsQuery = await dorm
.update({'username':'Dogs', 'email': 'iamnotagooddog@dogs.com'})
.table('dropthis')
.where(`_id <= ${updateId}`)
.returning()
.then((data: any) => {
  return data;
}).catch(e => e);

/* -------------------------------------------------------------------------- */
/*                    MULTIPLE ROWS QUERY IN UPDATE METHOD                    */
/* -------------------------------------------------------------------------- */

Deno.test(`multiple-rows query in "UPDATE" method:`, () => {
  const test = dorm.update({'username':'Dogs', 'password': 'ihave8Dogs'}).where(`user_id <= ${updateId}`)
  .from('userprofile')
  .returning('username');
  assertNotEquals(multipleRowsQuery, testUpdateQuery2, `Error:${updateId} rows was not updated `);
  assertEquals(test.info.action.type , 'UPDATE', 'Error:Type is not updated to UPDATE');
  assertEquals(test.info.action.columns , `username = 'Dogs', password = 'ihave8Dogs'`, `column is not updated to username = 'Dogs', password = 'ihave8Dogs'`);
  assertEquals(test.info.action.table , 'userprofile', 'Error:Table is not updated to userprofile');
  assertEquals(test.info.returning.active , true, 'Error:Returning is not updated');  
  assertEquals(test.info.returning.columns , 'username', 'Error:Columns in Returning is not reset');
  
  /* ------------------------ RESETTING INITIAL VALUES ------------------------ */
  
  test.toString();
  assertEquals(test.info.action.type , null, 'Error:Type is not reset');
  assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset');
  assertEquals(test.info.action.table , null, 'Error:Table is not reset');
  assertEquals(test.info.returning.active , false, 'Error:Returning is not reset');  
  assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning is not reset');
});

const testUpdateQuery3 = await dorm
.select()
.table('dropthis')
.then((data: any) => {
  return data.rows;
}).catch(e => e);

const allRowsUpdateQuery = await dorm
.update({'username':'restarted', 'email': 'iamagoodcat@cats.com'})
.table('dropthis')
.returning()
.then((data: any) => {
  return data;
}).catch(e => e);

/* -------------------------------------------------------------------------- */
/*                 ALL ROWS TO BE UPDATED USING UPDATE METHOD                 */
/* -------------------------------------------------------------------------- */

Deno.test(`all rows query in "UPDATE" method:`, () => {
  const test = dorm.update({'username':'restarted', 'password': 'iamADog'})
  .from('userprofile')
  .returning('username');
  assertNotEquals(allRowsUpdateQuery, testUpdateQuery3, 'Error:The whole table was not updated');
  assertEquals(test.info.action.type , 'UPDATE', 'Error:Type is not updated to UPDATE');
  assertEquals(test.info.action.columns , `username = 'restarted', password = 'iamADog'`, `column is not updated to username = 'restarted', password = 'iamADog'`);
  assertEquals(test.info.action.table , 'userprofile', 'Error:Table is not updated to userprofile');
  assertEquals(test.info.returning.active , true, 'Error:Returning is not updated');  
  assertEquals(test.info.returning.columns , 'username', 'Error:Columns in Returning is not reset');
  
  /* ------------------------ RESETTING INITIAL VALUES ------------------------ */
  
  test.toString();
  assertEquals(test.info.action.type , null, 'Error:Type is not reset');
  assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset');
  assertEquals(test.info.action.values , '', 'Error:Values are not reset');
  assertEquals(test.info.action.table , null, 'Error:Table is not reset');
  assertEquals(test.info.returning.active , false, 'Error:Returning is not reset');  
  assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning is not reset');
});

