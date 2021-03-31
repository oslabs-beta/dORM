import { Dorm } from '../lib/draft.ts';
import { assertEquals, assertNotEquals} from "../deps.ts";
import {url} from './test_url.ts'

/*
*@insert
*Invalid 
*Testing for INSERT method 
*Single row inserting
*Multiple rows inserting
*/

/*----------------- CONNECTING TO THE DATABASE -----------------*/
const database = url;
const dorm = new Dorm(database);

/*------------ CREATING TESTING ID------------*/
var updateId = Math.floor(Math.random()*35);

/*------------ TESTING INSERT METHOD ------------*/

const insertQuery = await dorm
.insert([{'username':'newDogs', 'password': 'new99', 'email': 'newdog@dog.com','created_on':'NOW()' }])
.from('userprofile')
.returning()
.then((data: any) => {
  return data;
})
const insertSelectQuery1 = await dorm
.select()
.from('userprofile')
.then((data: any) => {
  return data.rows;
})

Deno.test(`connection to the database:`, () => {
  assertNotEquals(insertQuery, undefined, 'connect should be returning a query.')
});


Deno.test(`all queries to be valid in "INSERT" method:`, () => {
  assertNotEquals(insertQuery, undefined, 'Error:the method should return a query result.')
  assertNotEquals(insertQuery, insertSelectQuery1, `Expected value: ${insertQuery} not to be equal to Received:${insertSelectQuery1}`)
});

const invalidInsert = await dorm
.insert([{'user':'newDogs'}])
.from('profile')
.where('user_id=1')
.then((data: any) => {
  return data.rows;
}).catch((e)=> {return false})

Deno.test(`all invalid queries should not work in "INSERT" method:`,() => {
  assertEquals(invalidInsert, false, `Error:INVALID query found!!!! It should  return an error for invalid query request from Postgres.`)
})
Deno.test(`single-row query in "INSERT" method:`,  () => {
  const columnName = [{'username':'singleLady'}];
  const tableName = 'userprofile';
  const returning = '*'
  const test = dorm
  .insert(columnName)
  .from(`${tableName}`)
  .returning(returning);
  console.log('test.info.action.values: ',test.info.action.values);
  assertEquals(test.info.action.type , 'INSERT', `Error:type is not updated to SELECT`);
  // assertEquals(test.info.action.values , `('singleLady')`, `Value is not updated to 'singleLady'`);
  assertEquals(test.info.action.table , tableName, `Error:table is not updated to ${tableName}`);
  // assertEquals(test.info.action.columns , 'username', `Error:column/columns are updated to ${columnName}`);

  /*----------------RESETTING INITIAL VALUES----------------*/
  test.toString();
  assertEquals(test.info.action.type , null, 'Error:Type is not reset after query');
  assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset after query');
  assertEquals(test.info.action.table , null, 'Error:Table is not reset after query');
  assertEquals(test.info.action.values , '', 'Error:Value is not reset after query');

  
});

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
  const returning = '*'
  const test =  dorm
  .insert(columnNames)
  .from(tableName)
  .returning();
  console.log('test.info.action.values: ',test.info.action.values);
  assertEquals(test.info.action.type , 'INSERT', 'Type is not updated to INSERT');
  // assertEquals(test.info.action.columns , 'username, password, email, created_on', `Columns are not updated to username`);
  // assertEquals(test.info.action.values , `('Golden_Retreiver', 'golDenR', 'iamagooddog@dogs.com', 'NOW()'), ('Superman', 'IamnotHuman', 'superman@superman.com', 'NOW()'), ('MrBing', 'BingbingBing', 'chandlerbing@bings.com', 'NOW()')`, `Value is not updated to ('Golden_Retreiver', 'golDenR', 'iamagooddog@dogs.com', 'NOW()'), ('Superman', 'IamnotHuman', 'superman@superman.com', 'NOW()'), ('MrBing', 'BingbingBing', 'chandlerbing@bings.com', 'NOW()')`);
  assertEquals(test.info.action.table , tableName, `Error:table is not updated to ${tableName}`);
  
  /*----------------RESETTING INITIAL VALUES----------------*/
  test.toString();
  assertEquals(test.info.action.type , null, 'Error:Type is not reset after query');
  assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset after query');
  assertEquals(test.info.action.table , null, 'Error:Table is not reset after query');
  assertEquals(test.info.action.values , '', 'Error:Value is not reset after query');
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

Deno.test(`multiple actions called in "INSERT" method:`,() => {
  assertEquals(edgeCase1 , edgeCaseErrors.case1, `Error:only one action/method should be allowed in 'INSERT' method`);
})
