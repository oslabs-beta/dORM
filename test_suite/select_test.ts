import { Dorm } from '../lib/draft.ts';
import { assertEquals, assertNotEquals} from "../deps.ts";
import {url} from './test_url.ts'

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
const database = url;
const dorm = new Dorm(database);


/*------------ CREATING TESTING ID------------*/
var updateId = Math.floor(Math.random()*35);

/*------------ TESTING SELECT METHOD ------------*/
const selectQuery = await dorm
.select()
.from('userprofile')
.where('user_id=1')
.then((data: any) => {
  return data.rows;
})
.catch((e)=> {throw e})
Deno.test(`connection to the database:`, () => {
  assertNotEquals(selectQuery,undefined, 'connect should be returning a query.');
});
Deno.test(`"SELECT" method:`, () => {
  assertNotEquals(selectQuery,undefined, `Error:the method should return a query result.`);
});
const invalidSelect = await dorm
.select()
.from('profile')
.where('user_id=1')
.then((data: any) => {
  return data.rows;
}).catch((e)=> {return false})

Deno.test(`all queries to be valid in "SELECT" method:`,() => {
  assertEquals(invalidSelect, false, `Error:INVALID query found!!!! It should  return an error for invalid query request from Postgres.`) 
})
Deno.test(`single-column query in "SELECT" method:`, () => {
  const columnName = 'username';
  const tableName = 'userprofile';
  const condition = 'user_id = 2'

  const test = dorm
  .select(`${columnName}`)
  .from(`${tableName}`)
  .where(`${condition}`);
  assertEquals(test.info.action.type , 'SELECT', `Error:type is not updated to SELECT`);
  assertEquals(test.info.action.columns , columnName, `Error:column/columns are updated to ${columnName}`);
  assertEquals(test.info.action.table , tableName, `Error:table is not updated to ${tableName}`);
  assertEquals(test.info.filter.where , true, `Error:where is not updated to true`);
  assertEquals(test.info.filter.condition , `${condition}`, `Error:condition is not updated to ${condition}`);

  /*----------------RESETTING INITIAL VALUES----------------*/
  test.toString();
  assertEquals(test.info.action.type , null, 'Error:Type is not reset after query');
  assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset after query');
  assertEquals(test.info.action.table , null, 'Error:Table is not reset after query');
  assertEquals(test.info.filter.where , false, `Error:where is not reset after query`);
  assertEquals(test.info.filter.condition , null, `Error:condition is not reset after query`);
})

Deno.test(`multiple-columns query in "SELECT" method:`,   () => {
  const columnName = 'username, email';
  const tableName = 'userprofile';
  const condition = 'user_id = 4'

  const test =  dorm.select(`${columnName}`).from(`${tableName}`).where(`${condition}`);
  assertEquals(test.info.action.type , 'SELECT', 'Error:Type is not updated to SELECT');
  assertEquals(test.info.action.columns , columnName, `Error:column/columns are updated to ${columnName}`);
  assertEquals(test.info.action.table , tableName, `Error:table is not updated to ${tableName}`);
  assertEquals(test.info.filter.where , true, `Error:where is not updated to true`);
  assertEquals(test.info.filter.condition , `${condition}`, `Error:condition is not updated to ${condition}`);
  
  /*----------------RESETTING INITIAL VALUES----------------*/
  test.toString();
  assertEquals(test.info.action.type , null, 'Error:Type is not reset after query');
  assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset');
  assertEquals(test.info.action.table , null, 'Error:Table is not reset after query');
  assertEquals(test.info.filter.where , false, `Error:where is not reset after query`);
  assertEquals(test.info.filter.condition , null, `Error:condition is not reset after query`);
})

const edgeCaseErrors ={
  case1 : '',
};
const edgeCase1 = await dorm
.select()
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

Deno.test(`multiple actions called in "SELECT" method:`,() => {
  assertEquals(edgeCase1 , edgeCaseErrors.case1, `Error:only one action/method should be allowed in 'SELECT' method`);
})