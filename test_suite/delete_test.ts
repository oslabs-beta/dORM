import { Dorm } from '../lib/draft.ts';
import { assertEquals, assertNotEquals} from "../deps.ts";
import {url} from './test_url.ts'

/*
*@select
*Invalid 
*Testing for DELETE method 
*Single row deleting
*Multiple rows deleting
*All rows deleting (the whole table update)
*/

/*-------- CONNECTING TO THE DATABASE --------*/
const database = url;
const dorm = new Dorm(database);

/*-------- CREATING NEW DATA TO PERFORM ALL DELETE TASK --------*/
const initialSetup = await dorm
.insert([
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
])
.from('delete')
.returning();

/*------------ CREATING TESTING ID------------*/
var updateId = Math.floor(Math.random()*35);

/*------------ TESTING DELETE METHOD ------------*/


// invalid queries
const invalidDelete = await dorm
.delete()
.from('users')
.where(`user_id = ${updateId}`)
.returning()
.then((data)=> {
  return data;
})
.catch((error)=> {
  return false;
});

Deno.test(`all queries to be valid in "DELETE" method:`, ()=> {
  const tableName = 'user';
  const condition = `user_id = ${updateId}`
  const test = dorm
  .delete()
  .from(tableName)
  .where(condition)
  .returning();
  assertEquals(invalidDelete, false,'Error:INVALID query found!!!! It should  return an error for invalid query request from Postgres.');
  assertEquals(test.info.action.type , 'DELETE', 'Error:Type is not updated to DELETE');
  assertEquals(test.info.action.table , tableName, 'Error:Table is not updated to userprofile');
  assertEquals(test.info.filter.where , true, `Error:where is not updated to true`);
  assertEquals(test.info.filter.condition , condition, `Error:condition is not updated to ${condition}`);
  assertEquals(test.info.returning.active , true, 'Error:Returning is not updated');  
  assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning is not reset');
  
  /*----------------RESETTING INITIAL VALUES----------------*/
  test.toString();
  assertEquals(test.info.action.type , null, 'Error:Type is not reset');
  assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset');
  assertEquals(test.info.action.values , '', 'Error:Values are not reset');
  assertEquals(test.info.action.table , null, 'Error:Table is not reset');
  assertEquals(test.info.filter.where , false, `Error:where is not reset after query`);
  assertEquals(test.info.filter.condition , null, `Error:condition is not reset after query`);
  assertEquals(test.info.returning.active , false, 'Error:Returning is not reset');  
  assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning is not reset');
})


const deleteOneQuery = await dorm
.delete()
.from('userprofile')
.where(`user_id = ${updateId}`)
.returning()
.then(data=> {
  return data;
});

const testDeleteQuery1 = await dorm
.select()
.from('userprofile')
.where(`user_id = ${updateId}`)
.then((data: any) => {
  return data.rows;
})

Deno.test(`single-row query in "DELETE" method:`, ()=> {
  const tableName = 'userprofile';
  const condition = `user_id = ${updateId+1}`
  const test = dorm
  .delete()
  .from(tableName)
  .where(condition)
  .returning();
  assertNotEquals(testDeleteQuery1, undefined,'Error:Delete query is not completed!');
  assertEquals(test.info.action.type , 'DELETE', 'Error:Type is not updated to DELETE');
  assertEquals(test.info.action.table , tableName, 'Error:Table is not updated to userprofile');
  assertEquals(test.info.filter.where , true, `Error:where is not updated to true`);
  assertEquals(test.info.filter.condition , condition, `Error:condition is not updated to ${condition}`);
  assertEquals(test.info.returning.active , true, 'Error:Returning is not updated');  
  assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning is not reset');
  
  /*----------------RESETTING INITIAL VALUES----------------*/
  test.toString()
  assertEquals(test.info.action.type , null, 'Error:Type is not reset');
  assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset');
  assertEquals(test.info.action.values , '', 'Error:Values are not reset');
  assertEquals(test.info.action.table , null, 'Error:Table is not reset');
  assertEquals(test.info.filter.where , false, `Error:where is not reset after query`);
  assertEquals(test.info.filter.condition , null, `Error:condition is not reset after query`);
  assertEquals(test.info.returning.active , false, 'Error:Returning is not reset');  
  assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning is not reset');
});

const deleteMultipleQuery = await dorm
.delete()
.from('userprofile')
.where(`user_id = ${updateId+1}`)
.returning()
.then(data=> {
  return data;
});
const testDeleteQuery2 = await dorm
.select()
.from('userprofile')
.where(`user_id = ${updateId+1}`)
.then((data: any) => {
  return data.rows;
})

Deno.test(`multiple-rows query in "DELETE" method:`, ()=> {
  const tableName = 'userprofile';
  const condition = `user_id > ${updateId+2}`
  const test = dorm
  .delete()
  .from(tableName)
  .where(condition)
  .returning();
  assertNotEquals(testDeleteQuery2, undefined,'Error:Multiple DELETE query is not completed!');
  assertEquals(test.info.action.type , 'DELETE', 'Error:Type is not updated to DELETE');
  assertEquals(test.info.action.table , tableName, 'Error:Table is not updated to userprofile');
  assertEquals(test.info.filter.where , true, `Error:where is not updated to true`);
  assertEquals(test.info.filter.condition , condition, `Error:condition is not updated to ${condition}`);
  assertEquals(test.info.returning.active , true, 'Error:Returning is not updated');  
  assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning is not reset');
  /*----------------RESETTING INITIAL VALUES----------------*/
  test.toString()
  assertEquals(test.info.action.type , null, 'Error:Type is not reset');
  assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset');
  assertEquals(test.info.action.values , '', 'Error:Values are not reset');
  assertEquals(test.info.action.table , null, 'Error:Table is not reset');
  assertEquals(test.info.filter.where , false, `Error:where is not reset after query`);
  assertEquals(test.info.filter.condition , null, `Error:condition is not reset after query`);
  assertEquals(test.info.returning.active , false, 'Error:Returning is not reset');  
  assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning is not reset');
})

const deleteAllQuery = await dorm
.delete()
.from('delete')
.returning()
.then(data=> {
  return data;
});
const testDeleteQuery3 = await dorm
.select()
.from('delete')
.then((data: any) => {
  return data.rows;
})

Deno.test(`all rows query in "DELETE" method:`, ()=> {
  const tableName = 'delete';
  const condition = ``
  const test = dorm
  .delete()
  .from(tableName)
  .where(condition)
  .returning();
  assertNotEquals(testDeleteQuery3, undefined,'Error:Multiple DELETE query is not completed!');
  assertEquals(test.info.action.type , 'DELETE', 'Error:Type is not updated to DELETE');
  assertEquals(test.info.action.table , tableName, 'Error:Table is not updated to userprofile');
  assertEquals(test.info.filter.where , true, `Error:where is not updated to true`);
  assertEquals(test.info.filter.condition , condition, `Error:condition is not updated to ${condition}`);
  assertEquals(test.info.returning.active , true, 'Error:Returning is not updated');  
  assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning is not reset');
  /*----------------RESETTING INITIAL VALUES----------------*/
  test.toString()
  assertEquals(test.info.action.type , null, 'Error:Type is not reset');
  assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset');
  assertEquals(test.info.action.values , '', 'Error:Values are not reset');
  assertEquals(test.info.action.table , null, 'Error:Table is not reset');
  assertEquals(test.info.filter.where , false, `Error:where is not reset after query`);
  assertEquals(test.info.filter.condition , null, `Error:condition is not reset after query`);
  assertEquals(test.info.returning.active , false, 'Error:Returning is not reset');  
  assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning is not reset');
})

const edgeCaseErrors ={
  case1 : '',
};
const edgeCase1 = await dorm
.insert([{'user':'newDogs'}])
.delete()
.from('userprofile')
.then((data: any) => {
  return data.rows;
})
.catch(error => {
  console.log('This is error:',error)
  edgeCaseErrors.case1=error
  return error
})
console.log('This is edgeCase1:',edgeCase1)

Deno.test(`multiple actions called in "DELETE" method:`,() => {
  assertEquals(edgeCase1 , edgeCaseErrors.case1, `Error:only one action/method should be allowed in 'DELETE' method`);
})
