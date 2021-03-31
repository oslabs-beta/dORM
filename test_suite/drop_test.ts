import { Dorm } from '../lib/draft.ts';
import { assertEquals, assertNotEquals} from "../deps.ts";
import {url} from './test_url.ts'
export { query, poolConnect } from '../lib/db-connector.ts';
/*
*@select
*Invalid 
*Testing for DELETE method 
*Single row deleting
*Multiple rows deleting
*All rows deleting (the whole table update)
*/

/*-------- CONNECTING TO THE DATABASE --------*/
const database = url; // paste your url here
const dorm = new Dorm(database);
// const createTable = `CREATE TABLE public.dropThis("_id" serial PRIMARY KEY,"username" VARCHAR ( 150 ) NULL,"email" VARCHAR ( 255 ) NULL)WITH (OIDS=FALSE);`
// const pool = await query(createTable);

Deno.test(`all queries to be valid in "DELETE" method:`, ()=> {
  const tableName = 'user';
  const condition = `user_id = ${updateId}`
  const test = dorm
  .drop()
  .from(tableName)
  .where(condition)
  .returning();
  console.log('test:',test);
  assertEquals(invalidDelete, [],'Error:INVALID query found!!!! It should  return an error for invalid query request from Postgres.');
  // assertEquals(test.info.action.type , null, 'Error:Type should not be updated to DELETE');
  // assertEquals(test.info.action.table , null, 'Error:Table should not be updated to userprofile');
  // assertEquals(test.info.filter.where , false, `Error:where should not be updated to true`);
  // assertEquals(test.info.filter.condition , null, `Error:condition should not be updated to ${condition}`);
  // assertEquals(test.info.returning.active , false, 'Error:Returning should not be updated');  
  // assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning should not be pdated');
  
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