import { Dorm } from '../lib/draft.ts';
import { assertEquals, assertNotEquals} from "../deps.ts";
import { config } from '../deps.ts';
/*
*@select
*Invalid 
*Testing for DELETE method 
*Single row deleting
*Multiple rows deleting
*All rows deleting (the whole table update)
*/

/*-------- CONNECTING TO THE DATABASE --------*/
const env = config();
// create .env file and add your database inside it. using followin variables USERNAME, PASSWORD, SERVER
const URL = `postgres://${env.USERNAME}:${env.PASSWORD}@${env.SERVER}.db.elephantsql.com:5432/${env.USERNAME}`;

const database = URL; // Or you can add your url here
const dorm = new Dorm(database);

/*-------- CREATING NEW DATA TO PERFORM ALL DELETE TASK --------*/
const initialSetup1 = await dorm
.insert([
  {
    'username':'Golden_Retreiver',
    'email':'iamagooddog@dogs.com',
  },
  {
    'username':'Superman',
    'email':'superman@superman.com',
  },
  {
    'username':'MrBing',
    'email':'chandlerbing@bings.com',
  },
  {
    'username':'Golden_Retreiver',
    'email':'iamagooddog@dogs.com',
  },
  {
    'username':'Superman',
    'email':'superman@superman.com',
  },
  {
    'username':'MrBing',
    'email':'chandlerbing@bings.com',
  }
])
.table('dropthis')
.returning()
.then((data:any) => data.rows)
.catch(e => e);

const initialSetup3 = `INSERT INTO 
dropthis
(username, email)
VALUES
('dorm Member 1', 'chandlerbing@bings.com'),
('dorm Member 2', 'chandlerbing@bings.com'),
('dorm Member 3', 'chandlerbing@bings.com'),
('dorm Member 4', 'chandlerbing@bings.com'),
('dorm Member 5', 'chandlerbing@bings.com');`
const insertToUser = await dorm.raw(initialSetup3);
/*------------ CREATING TESTING ID------------*/
var updateId = Math.floor(Math.random()*20);


/* -------------------------------------------------------------------------- */
/*                            QUERY VALIDATION TEST                           */
/* -------------------------------------------------------------------------- */

Deno.test(`all queries to be valid in "DELETE" method:`, ()=> {
  const tableName = 'users';
  const condition = `user_id = ${updateId+2}`
  const test = dorm
  .delete()
  .from(tableName)
  .where(condition)
  .returning();
  assertEquals(test.info.action.type , "DELETE", 'Error:Type should be updated to DELETE');
  assertEquals(test.info.action.table , tableName, `Error:Table should be updated to ${tableName}`);
  assertEquals(test.info.filter.where , true, `Error:where should be updated to true`);
  assertEquals(test.info.filter.condition , condition, `Error:condition should be updated to ${condition}`);
  assertEquals(test.info.returning.active , true, 'Error:Returning should be updated');  
  assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning should be pdated');
  
  /* ------------------------ RESETTING INITIAL VALUES ------------------------ */

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
.from('dropthis')
.where(`_id = ${updateId}`)
.returning()
.then((data:any)=> {
  return data.rows;
}).catch(e => e); // []

console.log('deleteOneQuery:', deleteOneQuery);
const testDeleteQuery1 = await dorm
.select()
.from('dropthis')
.where(`_id = ${updateId}`)
.then((data: any) => {
  return data.rows;
}).catch(e => e); // []

/* -------------------------------------------------------------------------- */
/*                         SINGLE ROW QUERY IN DELETE                         */
/* -------------------------------------------------------------------------- */

Deno.test(`single-row query in "DELETE" method:`, ()=> {
  const tableName = 'userprofile';
  const condition = `user_id = ${updateId+1}`
  const test = dorm
  .delete()
  .from(tableName)
  .where(condition)
  .returning();
  assertEquals(Array.isArray(deleteOneQuery), true ,'Error:Delete query is not completed!');
  assertEquals(test.info.action.type , 'DELETE', 'Error:Type is not updated to DELETE');
  assertEquals(test.info.action.table , tableName, 'Error:Table is not updated to userprofile');
  assertEquals(test.info.filter.where , true, `Error:where is not updated to true`);
  assertEquals(test.info.filter.condition , condition, `Error:condition is not updated to ${condition}`);
  assertEquals(test.info.returning.active , true, 'Error:Returning is not updated');  
  assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning is not reset');
  
  /* ------------------------ RESETTING INITIAL VALUES ------------------------ */
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
.from('dropthis')
.where(`_id = ${updateId+1}`)
.returning()
.then(data=> {
  return data;
}).catch(e => e);
const testDeleteQuery2 = await dorm
.select()
.from('dropthis')
.where(`_id = ${updateId+1}`)
.then((data: any) => {
  return data.rows;
}).catch(e => e);

/* -------------------------------------------------------------------------- */
/*                    MULTIPLE ROWS QUERY IN DELETE METHOD                    */
/* -------------------------------------------------------------------------- */

Deno.test(`multiple-rows query in "DELETE" method:`, ()=> {
  const tableName = 'users';
  const condition = `user_id > ${updateId+2}`
  const test = dorm
  .delete()
  .from(tableName)
  .where(condition)
  .returning();
  assertNotEquals(testDeleteQuery2, deleteMultipleQuery,'Error:Multiple DELETE query is not completed!');
  assertEquals(test.info.action.type , 'DELETE', 'Error:Type is not updated to DELETE');
  assertEquals(test.info.action.table , tableName, 'Error:Table is not updated to userprofile');
  assertEquals(test.info.filter.where , true, `Error:where is not updated to true`);
  assertEquals(test.info.filter.condition , condition, `Error:condition is not updated to ${condition}`);
  assertEquals(test.info.returning.active , true, 'Error:Returning is not updated');  
  assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning is not reset');
  
  /* ------------------------ RESETTING INITIAL VALUES ------------------------ */
  
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
.from('dropthis')
.returning()
.then(data=> {
  return data;
}).catch(e => e);


const testDeleteQuery3 = await dorm
.select()
.from('dropthis')
.then((data: any) => {
  return data.rows;
}).catch(e => e);

/* -------------------------------------------------------------------------- */
/*                         DELETING ALL ROWS IN DELETE                        */
/* -------------------------------------------------------------------------- */

Deno.test(`all rows cannot be deleted in "DELETE" method:`, () => {
  const tableName = 'users';
  const condition = ``
  const test = dorm
  .delete()
  .from(tableName)
  .where(condition)
  .returning();
  assertEquals(deleteAllQuery,'No delete without where (use deleteAll to delete all rows)','Error:Multiple DELETE query is not completed!');
  assertEquals(test.info.action.type , 'DELETE', 'Error:Type is not updated to DELETE');
  assertEquals(test.info.action.table , tableName, 'Error:Table is not updated to userprofile');
  assertEquals(test.info.filter.where , true, `Error:where is not updated to true`);
  assertEquals(test.info.filter.condition , condition, `Error:condition is not updated to ${condition}`);
  assertEquals(test.info.returning.active , true, 'Error:Returning is not updated');  
  assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning is not reset');
  
  /* ------------------------ RESETTING INITIAL VALUES ------------------------ */

  const reset = (arg:Dorm) => {
    arg.callOrder = [];
    
    arg.error = {
      id: 0,
      message: '',
    };
    
    arg.info = {
      action: {
        type: null,
        table: null,
        columns: '*',
        values: '',
      },
      join: [],
      filter: {
        where: false,
        condition: null,
      },
      returning: {
        active: false,
        columns: '*',
      },
    };
  } 
  reset(test);
  assertEquals(test.info.action.type , null, 'Error:Type is not reset');
  assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset');
  assertEquals(test.info.action.values , '', 'Error:Values are not reset');
  assertEquals(test.info.action.table , null, 'Error:Table is not reset');
  assertEquals(test.info.filter.where , false, `Error:where is not reset after query`);
  assertEquals(test.info.filter.condition , null, `Error:condition is not reset after query`);
  assertEquals(test.info.returning.active , false, 'Error:Returning is not reset');  
  assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning is not reset');
})