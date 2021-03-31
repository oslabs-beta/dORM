import { Dorm } from '../lib/draft.ts';
import { assertEquals, assertNotEquals} from "../deps.ts";
import {url} from './test_url.ts'

/*
*@select
*Invalid 
*Testing for UPDATE method 
*Single row updating
*Multiple rows updating
*All rows updating (the whole table update)
*/

/*-------- CONNECTING TO THE DATABASE --------*/
const database = url;
const dorm = new Dorm(database);


/*------------ CREATING TESTING ID------------*/
var updateId = Math.floor(Math.random()*35);


/*------------ TESTING UPDATE METHOD ------------*/

// invalid syntax cases : postgre error
const invalidUpdate = await dorm
.update({'user':'newDogs'})
.from('profile')
.where('user_id>1')
.returning()
.then((data: any) => {
})
.catch((e)=> {return false}) 
console.log(invalidUpdate);
Deno.test(`all queries to be valid in "UPDATE" method:`,() => {
  assertEquals(invalidUpdate, false, `Error:INVALID query found!!!! It should  return an error for invalid query request from Postgres.`)
})
const testUpdateQuery1 = await dorm
.select()
.from('userprofile')
.where(`user_id=${updateId}`)
.then((data: any) => {
  // console.log('Returned data:',data.rows);
  return data.rows;
})

const updateQuery = await dorm
.update({'username':'newDogs', 'password': 'iLoveDogs'}).where(`user_id = ${updateId}`)
.from('userprofile')
.returning()
.then((data: any) => {
  return data;
})


Deno.test(`a single-row query in "UPDATE" method:`, () => {
  const test = dorm.update({'username':'newDogs', 'password': 'iLoveDogs'}).where(`user_id = ${updateId+1}`)
  .from('userprofile')
  .returning('username')
  assertNotEquals(updateQuery, testUpdateQuery1 , 'Error: the method should work more than one row');
  // assertEquals(test.info.action.type , 'UPDATE', 'Error:Type is not updated to UPDATE');
  // assertEquals(test.info.action.columns , `username = 'newDogs', password = 'iLoveDogs'`, `Error:Columns are not updated to username = 'newDogs', password = 'iLoveDogs'`);
  // assertEquals(test.info.action.table , 'userprofile', 'Error:Table is not updated to userprofile');
  // assertEquals(test.info.returning.active , true, 'Error:Returning is not updated');  
  // assertEquals(test.info.returning.columns , 'username', 'Error:Columns in Returning is not reset');

  /*----------------RESETTING INITIAL VALUES----------------*/
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
.from('userprofile')
.where(`user_id <= ${updateId}`)
.then((data: any) => {
  // console.log('Returned data:',data.rows);
  return data.rows;
})

const multipleRowsQuery = await dorm
.update({'username':'Dogs', 'password': 'ihave8Dogs'})
.from('userprofile')
.where(`user_id <= ${updateId}`)
.returning()
.then((data: any) => {
  // console.log(data.rows);
  return data;
})

Deno.test(`multiple-rows query in "UPDATE" method:`, () => {
  const test = dorm.update({'username':'Dogs', 'password': 'ihave8Dogs'}).where(`user_id <= ${updateId}`)
  .from('userprofile')
  .returning('username');
  assertNotEquals(multipleRowsQuery, testUpdateQuery2, `Error:${updateId} rows was not updated `);
  // assertEquals(test.info.action.type , 'UPDATE', 'Error:Type is not updated to UPDATE');
  // assertEquals(test.info.action.columns , `username = 'Dogs', password = 'ihave8Dogs'`, `column is not updated to username = 'Dogs', password = 'ihave8Dogs'`);
  // assertEquals(test.info.action.table , 'userprofile', 'Error:Table is not updated to userprofile');
  // assertEquals(test.info.returning.active , true, 'Error:Returning is not updated');  
  // assertEquals(test.info.returning.columns , 'username', 'Error:Columns in Returning is not reset');

  /*----------------RESETTING INITIAL VALUES----------------*/
  test.toString();
  assertEquals(test.info.action.type , null, 'Error:Type is not reset');
  assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset');
  assertEquals(test.info.action.table , null, 'Error:Table is not reset');
  assertEquals(test.info.returning.active , false, 'Error:Returning is not reset');  
  assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning is not reset');
});

const testUpdateQuery3 = await dorm
.select()
.from('userprofile')
.then((data: any) => {
  return data.rows;
})

const allRowsUpdateQuery = await dorm
.update({'username':'restarted', 'password': 'iamADog'})
.from('userprofile')
.returning()
.then((data: any) => {
  return data;
})
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
  
  /*----------------RESETTING INITIAL VALUES----------------*/
  test.toString();
  assertEquals(test.info.action.type , null, 'Error:Type is not reset');
  assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset');
  assertEquals(test.info.action.values , '', 'Error:Values are not reset');
  assertEquals(test.info.action.table , null, 'Error:Table is not reset');
  assertEquals(test.info.returning.active , false, 'Error:Returning is not reset');  
  assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning is not reset');
  
});

const edgeCaseErrors ={
  case1 : '',
};
const edgeCase1 = await dorm
.insert([{'user':'newDogs'}])
.delete()
.from('userprofile')
.then((data: any) => {
  return data;
})
.catch(error => {
  console.log('This is error:',error)
  edgeCaseErrors.case1=error
  return error
})
console.log('This is edgeCase1:',edgeCase1)

Deno.test(`multiple actions called in "UPDATE" method:`,() => {
  assertEquals(edgeCase1 , edgeCaseErrors.case1, `Error:only one action/method should be allowed in 'UPDATE' method`);
})
