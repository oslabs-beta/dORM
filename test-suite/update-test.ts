import { Dorm } from '../lib/query-builder';
import { assertEquals, assertNotEquals } from '../deps';
import { config } from '../deps';

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
const URL = `postgres://${env.USERNAME}:${env.PASSWORD}@${env.SERVER}:5432/${env.USERNAME}`;

const database = URL; // Or you can add your url here
const dorm = new Dorm(database);

/*------------ CREATING TESTING ID------------*/
var updateId = 2;

/* -------------------------------------------------------------------------- */
/*                      SINGLE ROW QUERY IN UPDATE METHOD                     */
/* -------------------------------------------------------------------------- */

const updateQuery = await dorm
.update({'username':'updatedDogs', 'email': 'updated@dogs.com'})
.where(`_id = ${updateId}`)
.table('dropthis')
.returning()
.then((data: any) => {
  return data.rows;
})
.catch((e:any) => e);




Deno.test(`a single-row query in "UPDATE" method:`, () => {
  const test = dorm.update({'username':'newDogs', 'password': 'iLoveDogs'}).where(`user_id = ${updateId+1}`)
  .from('userprofile') .returning(); 

  assertEquals(updateQuery, [] , 'Error: the method should work more than one row');
  assertEquals(test.info.action.type , 'UPDATE', 'Error:Type is not updated to UPDATE');
  assertEquals(test.info.action.table , 'userprofile', 'Error:Table is not updated to userprofile');
  assertEquals(test.info.returning.active , true, 'Error:Returning is not updated');  
  assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning is not reset');
  
  /* ------------------------ RESETTING INITIAL VALUES ------------------------ */
  
test.toString();
  assertEquals(test.info.action.type , null, 'Error:Type is not reset');
  assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset');
  assertEquals(test.info.action.values , [], 'Error:Values are not reset');
  assertEquals(test.info.action.table , null, 'Error:Table is not reset');
  assertEquals(test.info.returning.active , false, 'Error:Returning is not reset');  
  assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning is not reset');
});


/* -------------------------------------------------------------------------- */
/*                    MULTIPLE ROWS QUERY IN UPDATE METHOD                    */
/* -------------------------------------------------------------------------- */


const multipleRowsQuery = await dorm
.update({'username':'Dogs', 'email': 'iamnotagooddog@dogs.com'})
.table('dropthis')
.where(`_id < ${updateId}`)
.returning()
.then((data: any) => {
  return data.rows;
}).catch((e:any) => e);

console.log('multipleRowsQuery:', multipleRowsQuery)

Deno.test(`multiple-rows query in "UPDATE" method:`, () => {
  const test = dorm
  .update({'username':'Dogs', 'password': 'ihave8Dogs'})
  .where(`user_id <= ${updateId}`)
  .table('userprofile')
  .returning();
  assertEquals(Array.isArray(multipleRowsQuery), true, `Error:${updateId} rows was not updated `);
  assertEquals(test.info.action.type , 'UPDATE', 'Error:Type is not updated to UPDATE');
  assertEquals(test.info.action.table , 'userprofile', 'Error:Table is not updated to userprofile');
  assertEquals(test.info.returning.active , true, 'Error:Returning is not updated');  
  assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning is not reset');
  
  /* ------------------------ RESETTING INITIAL VALUES ------------------------ */
  
const testQuery = test.toString();
  assertEquals(testQuery , `UPDATE userprofile SET username = $1, password = $2 WHERE user_id < = $3 RETURNING *`, 'Error:Querybuilder is returning unparametrized query string!!');
  assertEquals(test.info.action.type , null, 'Error:Type is not reset');
  assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset');
  assertEquals(test.info.action.table , null, 'Error:Table is not reset');
  assertEquals(test.info.returning.active , false, 'Error:Returning is not reset');  
  assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning is not reset');
});

/* -------------------------------------------------------------------------- */
/*                 ALL ROWS TO BE UPDATED USING UPDATE METHOD                 */
/* -------------------------------------------------------------------------- */

const allRowsUpdateQuery = await dorm
.update({'username':'restarted', 'email': 'iamagoodcat@cats.com'})
.table('dropthis')
.returning()
.then((data: any) => {
  return data.rows;
}).catch((e:any) => e);


Deno.test(`all rows query in "UPDATE" method:`, () => {
  const test = dorm.update({'username':'restarted', 'password': 'iamADog'})
  .from('userprofile')
  .returning('username');
  assertEquals(Array.isArray(allRowsUpdateQuery), true,'Error:The whole table was not updated');
  assertEquals(test.info.action.type , 'UPDATE', 'Error:Type is not updated to UPDATE');
  assertEquals(test.info.action.table , 'userprofile', 'Error:Table is not updated to userprofile');
  assertEquals(test.info.returning.active , true, 'Error:Returning is not updated');  
  assertEquals(test.info.returning.columns , 'username', 'Error:Columns in Returning is not reset');
  
  /* ------------------------ RESETTING INITIAL VALUES ------------------------ */
  
  const testQuery = test.toString();
  assertEquals(testQuery , `UPDATE userprofile SET username = $1, password = $2 RETURNING username`, 'Error:Querybuilder is returning unparametrized query string!!');
  assertEquals(test.info.action.type , null, 'Error:Type is not reset');
  assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset');
  assertEquals(test.info.action.values , [], 'Error:Values are not reset');
  assertEquals(test.info.action.table , null, 'Error:Table is not reset');
  assertEquals(test.info.returning.active , false, 'Error:Returning is not reset');  
  assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning is not reset');
});
