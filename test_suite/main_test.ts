import { Dorm } from '../lib/query-builder.ts';
import { assertEquals, assertNotEquals} from "../deps.ts";
import { config } from '../deps.ts';

/* ------------------------------ TESTING SCOPE ----------------------------- */

/*
* @basic_cases {Query Completion, Data update,}
* @edge_cases {Invalid strings, multiple methods, postgre error return, error handling}
*/

const env = config();
// create .env file and add your database inside it. using followin variables USERNAME, PASSWORD, SERVER
const URL = `postgres://${env.USERNAME}:${env.PASSWORD}@${env.SERVER}.db.elephantsql.com:5432/${env.USERNAME}`;

const database = URL; // Or you can add your url here
const dorm = new Dorm(database);

/* --------------------------- CREATING TESTING ID -------------------------- */

var updateId = Math.floor(Math.random()*3);


/* -------------------------------------------------------------------------- */
/*                      MAKING INITIAL QUERIES FOR TESTS                      */
/* -------------------------------------------------------------------------- */


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
.catch((e:any) => e);

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


/* -------------------------------------------------------------------------- */
/*                                SELECT METHOD                               */
/* -------------------------------------------------------------------------- */

/* ------------------------------ NORMAL SELECT ----------------------------- */

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

/* ------------------------- INVALAID SELECT METHOD ------------------------- */

const invalidSelect = await dorm
.select()
.from('profile')
.where('_id=1')
.then((data: any) => {
  return data.rows;
}).catch((e:any)=> {return false})

Deno.test(`all queries to be valid in "SELECT" method:`,() => {
  assertEquals(invalidSelect, false, `Error:INVALID query found!!!! It should  return an error for invalid query request from Postgres.`) 
})

/* ----------------------- SINGLE COLUMN SELECT METHOD ---------------------- */

Deno.test(`single-column query in "SELECT" method:`, () => {
  const tableName = 'userprofile';
  const condition = 'user_id = 2'

  const test = dorm.select().from('userprofile').where('user_id = 2');
 console.log(' test.info.filter.condition:',  test.info.filter.condition)
  assertEquals(test.info.action.type , 'SELECT', `Error:type is not updated to SELECT`);
  // assertEquals(test.info.action.columns , '*', `Error:column/columns are updated to *`);
  assertEquals(test.info.action.table , tableName, `Error:table is not updated to ${tableName}`);
  assertEquals(test.info.filter.where , true, `Error:where is not updated to true`);
  // assertEquals(test.info.filter.condition ,condition, `Error:condition is not updated to ${condition}`);
  
  /* ------------------------ RESETTING INITIAL VALUES ------------------------ */
  
  const testQuery = test.toString();
  
  assertEquals(testQuery , `SELECT * FROM userprofile WHERE user_id = 2`, 'Error:Querybuilder is returning INVALID query string!!');
  assertEquals(test.info.action.type , null, 'Error:Type is not reset after query');
  assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset after query');
  assertEquals(test.info.action.table , null, 'Error:Table is not reset after query');
  assertEquals(test.info.filter.where , false, `Error:where is not reset after query`);
  assertEquals(test.info.filter.condition , null, `Error:condition is not reset after query`);
})

/* --------------------- MULTIPLE COLUMNS SELECT METHOD --------------------- */

// Deno.test(`multiple-columns query in "SELECT" method:`,   () => {
//   const columnName = 'username, email';
//   const tableName = 'userprofile';
//   const condition = 'user_id = 1'
  
//   const test =  dorm.select(columnName).from(tableName).where(condition);
//   assertEquals(test.info.action.type , 'SELECT', 'Error:Type is not updated to SELECT');
//   assertEquals(test.info.action.columns , columnName, `Error:column/columns are updated to ${columnName}`);
//   assertEquals(test.info.action.table , tableName, `Error:table is not updated to ${tableName}`);
//   assertEquals(test.info.filter.where , true, `Error:where is not updated to true`);
//   assertEquals(test.info.filter.condition , `${condition}`, `Error:condition is not updated to ${condition}`);
  
//   /* ------------------------ RESETTING INITIAL VALUES ------------------------ */
  
//   const testQuery = test.toString();
//   assertEquals(testQuery , `SELECT username, email FROM userprofile WHERE user_id = 1`, 'Error:Querybuilder is returning INVALID query string!!');
//   assertEquals(test.info.action.type , null, 'Error:Type is not reset after query');
//   assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset');
//   assertEquals(test.info.action.table , null, 'Error:Table is not reset after query');
//   assertEquals(test.info.filter.where , false, `Error:where is not reset after query`);
//   assertEquals(test.info.filter.condition , null, `Error:condition is not reset after query`);
// })



// /* -------------------------------------------------------------------------- */
// /*                                INSERT METHOD                               */
// /* -------------------------------------------------------------------------- */

// const insertQuery = await dorm
// .insert([{'username':'newDogs', 'email': 'newdog@dog.com' }])
// .table('dropthis')
// .returning()
// .then((data: any) => {
//   return data;
// })
// const insertSelectQuery1 = await dorm
// .select()
// .table('dropthis')
// .then((data: any) => {
//   return data.rows;
// })

// /* ----------------------- VALIDATION OF INSERT METHOD ---------------------- */

// Deno.test(`all queries to be valid in "INSERT" method:`, () => {
//   assertNotEquals(insertQuery, undefined, 'Error:the method should return a query result.')
//   assertNotEquals(insertQuery, insertSelectQuery1, `Expected value: ${insertQuery} not to be equal to Received:${insertSelectQuery1}`)
// });

// const invalidInsert = await dorm
// .insert([{'user':'newDogs'}])
// .delete('dropthis')
// .table('dropthis')
// .where('_id=1')
// .then((data: any) => {
//   return data.rows;
// }).catch((e:any)=> {return e})

// Deno.test(`all invalid queries should not work in "INSERT" method:`,() => {
//   assertEquals(invalidInsert, 'No multiple actions', `Error:INVALID query found!!!! It should  return an error for invalid query request from Postgres.`)
// })

// /* -------------------- SINGLE ROW QUERY IN INSERT METHOD ------------------- */

// Deno.test(`single-row query in "INSERT" method:`,  () => {
//   const columnName = [{'username':'singleLady'}];
//   const tableName = 'users';
//   const returning = '*'
//   const test = dorm
//   .insert(columnName)
//   .from(`${tableName}`)
//   .returning(returning);
//   assertEquals(test.info.action.type , 'INSERT', `Error:type is not updated to SELECT`);
//   assertEquals(test.info.action.values , `('singleLady')`, `Value is not updated to 'singleLady'`);
//   assertEquals(test.info.action.table , tableName, `Error:table is not updated to ${tableName}`);
//   assertEquals(test.info.action.columns , 'username', `Error:column/columns are updated to ${columnName}`);
  
//   /* ------------------------ RESETTING INITIAL VALUES ------------------------ */
//   test.toString();
//   assertEquals(test.info.action.type , null, 'Error:Type is not reset after query');
//   assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset after query');
//   assertEquals(test.info.action.table , null, 'Error:Table is not reset after query');
//   assertEquals(test.info.action.values , '', 'Error:Value is not reset after query');
// });

// /* ------------------ MULTIPLE ROWS QUERY IN INSERT METHOD ------------------ */

// Deno.test(`multiple-rows query in "INSERT" method:`,  () => {
//   const columnNames = [
//     {
//       'username':'Golden_Retreiver',
//       'password': 'golDenR',
//       'email':'iamagooddog@dogs.com',
//       'created_on': 'NOW()'
//     },
//     {
//       'username':'Superman',
//       'password':'IamnotHuman',
//       'email':'superman@superman.com',
//       'created_on': 'NOW()'
//     },
//     {
//       'username':'MrBing',
//       'password':'BingbingBing',
//       'email':'chandlerbing@bings.com',
//       'created_on': 'NOW()'
//     }
//   ];
//   const tableName = 'userprofile';
//   const test = dorm
//   .insert(columnNames)
//   .table(tableName)
//   assertEquals(test.info.action.type , 'INSERT', 'Type is not updated to INSERT');
//   assertEquals(test.info.action.columns , 'username, password, email, created_on', `Columns are not updated to username`);
//   assertEquals(test.info.action.values , `('Golden_Retreiver', 'golDenR', 'iamagooddog@dogs.com', 'NOW()'), ('Superman', 'IamnotHuman', 'superman@superman.com', 'NOW()'), ('MrBing', 'BingbingBing', 'chandlerbing@bings.com', 'NOW()')`, `Value is not updated to ('Golden_Retreiver', 'golDenR', 'iamagooddog@dogs.com', 'NOW()'), ('Superman', 'IamnotHuman', 'superman@superman.com', 'NOW()'), ('MrBing', 'BingbingBing', 'chandlerbing@bings.com', 'NOW()')`);
//   assertEquals(test.info.action.table , tableName, `Error:table is not updated to ${tableName}`);
  
//   /* ------------------------ RESETTING INITIAL VALUES ------------------------ */

//   test.toString();
//   assertEquals(test.info.action.type , null, 'Error:Type is not reset after query');
//   assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset after query');
//   assertEquals(test.info.action.table , null, 'Error:Table is not reset after query');
//   assertEquals(test.info.action.values , '', 'Error:Value is not reset after query');
// });


// /* -------------------------------------------------------------------------- */
// /*                                UPDATE METHOD                               */
// /* -------------------------------------------------------------------------- */

// const updateQuery = await dorm
// .update({'username':'updatedDogs', 'email': 'updated@dogs.com'})
// .where(`_id = ${updateId}`)
// .table('dropthis')
// .returning()
// .then((data: any) => {
//   return data.rows;
// }).catch((e:any) => e);

// const testUpdateQuery1 = await dorm
// .select()
// .table('dropthis')
// .where(`_id=${updateId}`)
// .then((data: any) => {
  
//   return data.rows;
// }).catch((e:any) => e);
 
// /* -------------------- SINGLE ROW QUERY IN UPDATE METHOD ------------------- */

// Deno.test(`a single-row query in "UPDATE" method:`, () => {
//   const test = dorm.update({'username':'newDogs', 'password': 'iLoveDogs'}).where(`user_id = ${updateId+1}`)
//   .from('userprofile')  
//   .returning('username')
//   assertEquals(updateQuery, testUpdateQuery1 , 'Error: the method should work more than one row');
//   assertEquals(test.info.action.type , 'UPDATE', 'Error:Type is not updated to UPDATE');
//   assertEquals(test.info.action.columns , `username = 'newDogs', password = 'iLoveDogs'`, `Error:Columns are not updated to username = 'newDogs', password = 'iLoveDogs'`);
  
  
//   assertEquals(test.info.action.table , 'userprofile', 'Error:Table is not updated to userprofile');
//   assertEquals(test.info.returning.active , true, 'Error:Returning is not updated');  
//   assertEquals(test.info.returning.columns , 'username', 'Error:Columns in Returning is not reset');
  
//   /* ------------------------ RESETTING INITIAL VALUES ------------------------ */
  
//   test.toString();
//   assertEquals(test.info.action.type , null, 'Error:Type is not reset');
//   assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset');
//   assertEquals(test.info.action.values , '', 'Error:Values are not reset');
//   assertEquals(test.info.action.table , null, 'Error:Table is not reset');
//   assertEquals(test.info.returning.active , false, 'Error:Returning is not reset');  
//   assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning is not reset');
  
// });


// const testUpdateQuery2 = await dorm
// .select()
// .table('userprofile')
// .where(`user_id <= ${updateId}`)
// .then((data: any) => {
//   return data.rows;
// }).catch((e:any) => e);

// const multipleRowsQuery = await dorm
// .update({'username':'Dogs', 'email': 'iamnotagooddog@dogs.com'})
// .table('dropthis')
// .where(`_id <= ${updateId}`)
// .returning()
// .then((data: any) => {
//   return data;
// }).catch((e:any) => e);

// /* ------------------ MULTIPLE ROWS QUERY IN UPDATE METHOD ------------------ */

// Deno.test(`multiple-rows query in "UPDATE" method:`, () => {
//   const test = dorm.update({'username':'Dogs', 'password': 'ihave8Dogs'}).where(`user_id <= ${updateId}`)
//   .from('userprofile')
//   .returning('username');
//   assertNotEquals(multipleRowsQuery, testUpdateQuery2, `Error:${updateId} rows was not updated `);
//   assertEquals(test.info.action.type , 'UPDATE', 'Error:Type is not updated to UPDATE');
//   assertEquals(test.info.action.columns , `username = 'Dogs', password = 'ihave8Dogs'`, `column is not updated to username = 'Dogs', password = 'ihave8Dogs'`);
//   assertEquals(test.info.action.table , 'userprofile', 'Error:Table is not updated to userprofile');
//   assertEquals(test.info.returning.active , true, 'Error:Returning is not updated');  
//   assertEquals(test.info.returning.columns , 'username', 'Error:Columns in Returning is not reset');
  
//   /* ------------------------ RESETTING INITIAL VALUES ------------------------ */
  
//   test.toString();
//   assertEquals(test.info.action.type , null, 'Error:Type is not reset');
//   assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset');
//   assertEquals(test.info.action.table , null, 'Error:Table is not reset');
//   assertEquals(test.info.returning.active , false, 'Error:Returning is not reset');  
//   assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning is not reset');
// });

// const testUpdateQuery3 = await dorm
// .select()
// .table('dropthis')
// .then((data: any) => {
//   return data.rows;
// }).catch((e:any) => e);

// const allRowsUpdateQuery = await dorm
// .update({'username':'restarted', 'email': 'iamagoodcat@cats.com'})
// .table('dropthis')
// .returning()
// .then((data: any) => {
//   return data;
// }).catch((e:any) => e);

// /* --------------- ALL ROWS TO BE UPDATED USING UPDATE METHOD --------------- */

// Deno.test(`all rows query in "UPDATE" method:`, () => {
//   const test = dorm.update({'username':'restarted', 'password': 'iamADog'})
//   .from('userprofile')
//   .returning('username');
//   assertNotEquals(allRowsUpdateQuery, testUpdateQuery3, 'Error:The whole table was not updated');
//   assertEquals(test.info.action.type , 'UPDATE', 'Error:Type is not updated to UPDATE');
//   assertEquals(test.info.action.columns , `username = 'restarted', password = 'iamADog'`, `column is not updated to username = 'restarted', password = 'iamADog'`);
//   assertEquals(test.info.action.table , 'userprofile', 'Error:Table is not updated to userprofile');
//   assertEquals(test.info.returning.active , true, 'Error:Returning is not updated');  
//   assertEquals(test.info.returning.columns , 'username', 'Error:Columns in Returning is not reset');
  
//   /* ------------------------ RESETTING INITIAL VALUES ------------------------ */
  
//   test.toString();
//   assertEquals(test.info.action.type , null, 'Error:Type is not reset');
//   assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset');
//   assertEquals(test.info.action.values , '', 'Error:Values are not reset');
//   assertEquals(test.info.action.table , null, 'Error:Table is not reset');
//   assertEquals(test.info.returning.active , false, 'Error:Returning is not reset');  
//   assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning is not reset');
// });


// /* -------------------------------------------------------------------------- */
// /*                                DELETE METHOD                               */
// /* -------------------------------------------------------------------------- */

// Deno.test(`all queries to be valid in "DELETE" method:`, ()=> {
//   const tableName = 'users';
//   const condition = `user_id = ${updateId+2}`
//   const test = dorm
//   .delete()
//   .from(tableName)
//   .where(condition)
//   .returning();
//   assertEquals(test.info.action.type , "DELETE", 'Error:Type should be updated to DELETE');
//   assertEquals(test.info.action.table , tableName, `Error:Table should be updated to ${tableName}`);
//   assertEquals(test.info.filter.where , true, `Error:where should be updated to true`);
//   assertEquals(test.info.filter.condition , condition, `Error:condition should be updated to ${condition}`);
//   assertEquals(test.info.returning.active , true, 'Error:Returning should be updated');  
//   assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning should be pdated');
  
//   /* ------------------------ RESETTING INITIAL VALUES ------------------------ */
//   test.toString();
//   assertEquals(test.info.action.type , null, 'Error:Type is not reset');
//   assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset');
//   assertEquals(test.info.action.values , '', 'Error:Values are not reset');
//   assertEquals(test.info.action.table , null, 'Error:Table is not reset');
//   assertEquals(test.info.filter.where , false, `Error:where is not reset after query`);
//   assertEquals(test.info.filter.condition , null, `Error:condition is not reset after query`);
//   assertEquals(test.info.returning.active , false, 'Error:Returning is not reset');  
//   assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning is not reset');
// })


// const deleteOneQuery = await dorm
// .delete()
// .from('dropthis')
// .where(`_id = ${updateId}`)
// .returning()
// .then((data:any)=> {
//   return data.rows;
// }).catch((e:any) => e); // []


// const testDeleteQuery1 = await dorm
// .select()
// .from('dropthis')
// .where(`_id = ${updateId}`)
// .then((data: any) => {
//   return data.rows;
// }).catch((e:any) => e); // []

// /* ----------------------- SINGLE ROW QUERY IN DELETE ----------------------- */

// Deno.test(`single-row query in "DELETE" method:`, ()=> {
//   const tableName = 'userprofile';
//   const condition = `user_id = ${updateId+1}`
//   const test = dorm
//   .delete()
//   .from(tableName)
//   .where(condition)
//   .returning();
//   assertEquals(Array.isArray(deleteOneQuery), true ,'Error:Delete query is not completed!');
//   assertEquals(test.info.action.type , 'DELETE', 'Error:Type is not updated to DELETE');
//   assertEquals(test.info.action.table , tableName, 'Error:Table is not updated to userprofile');
//   assertEquals(test.info.filter.where , true, `Error:where is not updated to true`);
//   assertEquals(test.info.filter.condition , condition, `Error:condition is not updated to ${condition}`);
//   assertEquals(test.info.returning.active , true, 'Error:Returning is not updated');  
//   assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning is not reset');
  
//   /* ------------------------ RESETTING INITIAL VALUES ------------------------ */
//   test.toString()
//   assertEquals(test.info.action.type , null, 'Error:Type is not reset');
//   assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset');
//   assertEquals(test.info.action.values , '', 'Error:Values are not reset');
//   assertEquals(test.info.action.table , null, 'Error:Table is not reset');
//   assertEquals(test.info.filter.where , false, `Error:where is not reset after query`);
//   assertEquals(test.info.filter.condition , null, `Error:condition is not reset after query`);
//   assertEquals(test.info.returning.active , false, 'Error:Returning is not reset');  
//   assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning is not reset');
// });

// const deleteMultipleQuery = await dorm
// .delete()
// .from('dropthis')
// .where(`_id = ${updateId+1}`)
// .returning()
// .then((data:any)=> {
//   return data;
// }).catch((e:any) => e);
// const testDeleteQuery2 = await dorm
// .select()
// .from('dropthis')
// .where(`_id = ${updateId+1}`)
// .then((data: any) => {
//   return data.rows;
// }).catch((e:any) => e);

// /* ------------------ MULTIPLE ROWS QUERY IN DELETE METHOD ------------------ */

// Deno.test(`multiple-rows query in "DELETE" method:`, ()=> {
//   const tableName = 'users';
//   const condition = `user_id > ${updateId+2}`
//   const test = dorm
//   .delete()
//   .from(tableName)
//   .where(condition)
//   .returning();
//   assertNotEquals(testDeleteQuery2, deleteMultipleQuery,'Error:Multiple DELETE query is not completed!');
//   assertEquals(test.info.action.type , 'DELETE', 'Error:Type is not updated to DELETE');
//   assertEquals(test.info.action.table , tableName, 'Error:Table is not updated to userprofile');
//   assertEquals(test.info.filter.where , true, `Error:where is not updated to true`);
//   assertEquals(test.info.filter.condition , condition, `Error:condition is not updated to ${condition}`);
//   assertEquals(test.info.returning.active , true, 'Error:Returning is not updated');  
//   assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning is not reset');
  
//   /* ------------------------ RESETTING INITIAL VALUES ------------------------ */
  
//   test.toString()
//   assertEquals(test.info.action.type , null, 'Error:Type is not reset');
//   assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset');
//   assertEquals(test.info.action.values , '', 'Error:Values are not reset');
//   assertEquals(test.info.action.table , null, 'Error:Table is not reset');
//   assertEquals(test.info.filter.where , false, `Error:where is not reset after query`);
//   assertEquals(test.info.filter.condition , null, `Error:condition is not reset after query`);
//   assertEquals(test.info.returning.active , false, 'Error:Returning is not reset');  
//   assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning is not reset');
// })

// const deleteAllQuery = await dorm
// .delete()
// .from('dropthis')
// .returning()
// .then((data:any)=> {
//   return data;
// }).catch((e:any) => e);


// const testDeleteQuery3 = await dorm
// .select()
// .from('dropthis')
// .then((data: any) => {
//   return data.rows;
// }).catch((e:any) => e);

// /* ---------------------- DELETING ALL ROWS IN DELETE ---------------------- */

// Deno.test(`all rows cannot be deleted in "DELETE" method:`, ()=> {
//   const tableName = 'users';
//   const condition = ``
//   const test = dorm
//   .delete()
//   .from(tableName)
//   .where(condition)
//   .returning();
//   assertEquals(deleteAllQuery,'No delete without where (use deleteAll to delete all rows)','Error:Multiple DELETE query is not completed!');
//   assertEquals(test.info.action.type , 'DELETE', 'Error:Type is not updated to DELETE');
//   assertEquals(test.info.action.table , tableName, 'Error:Table is not updated to userprofile');
//   assertEquals(test.info.filter.where , true, `Error:where is not updated to true`);
//   assertEquals(test.info.filter.condition , condition, `Error:condition is not updated to ${condition}`);
//   assertEquals(test.info.returning.active , true, 'Error:Returning is not updated');  
//   assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning is not reset');
  
//   /* ------------------------ RESETTING INITIAL VALUES ------------------------ */

//   const reset = (arg:Dorm) => {
//     arg.callOrder = [];
    
//     arg.error = {
//       id: 0,
//       message: '',
//     };
    
//     arg.info = {
//       action: {
//         type: null,
//         table: null,
//         columns: '*',
//         values: [],
//         valuesParam: '',
//       },
//       join: [],
//       filter: {
//         where: false,
//         condition: null,
//       },
//       returning: {
//         active: false,
//         columns: '*',
//       },
//     };
//   } 
//   reset(test);
//   assertEquals(test.info.action.type , null, 'Error:Type is not reset');
//   assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset');
//   assertEquals(test.info.action.values , '', 'Error:Values are not reset');
//   assertEquals(test.info.action.table , null, 'Error:Table is not reset');
//   assertEquals(test.info.filter.where , false, `Error:where is not reset after query`);
//   assertEquals(test.info.filter.condition , null, `Error:condition is not reset after query`);
//   assertEquals(test.info.returning.active , false, 'Error:Returning is not reset');  
//   assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning is not reset');
// })



// /* -------------------------------------------------------------------------- */
// /*                                 DROP METHOD                                */
// /* -------------------------------------------------------------------------- */

// const idropThis = await dorm
// .drop()
// .from('dropthis')
// .then((data:any)=>{
//   return data.rows;
// }).catch((e:any) => e);

// /* ------------------------- VALIDATION TEST IN DROP ------------------------ */

// Deno.test(`all queries to be valid in "DROP" method:`, ()=> {
//   const tableName = 'dropthis';
//   const test = dorm
//   .drop()
//   .from(tableName)
//   .returning();
//   assertEquals(idropThis,[],'Error:INVALID query found!!!! It should  return an error for invalid query request from Postgres.');
//   assertEquals(test.info.action.type , 'DROP', 'Error:Type should be updated to DROP');
//   assertEquals(test.info.action.table , tableName, `Error:Table should be updated to ${tableName}`);
//   assertEquals(test.info.returning.active , true, 'Error:Returning should be updated to true');  

//   /* ------------------------ RESETTING INITIAL VALUES ------------------------ */
//   test.toString();
//   assertEquals(test.info.action.type , null, 'Error:Type is not reset');
//   assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset');
//   assertEquals(test.info.action.values , '', 'Error:Values are not reset');
//   assertEquals(test.info.action.table , null, 'Error:Table is not reset');
//   assertEquals(test.info.filter.where , false, `Error:where is not reset after query`);
//   assertEquals(test.info.filter.condition , null, `Error:condition is not reset after query`);
//   assertEquals(test.info.returning.active , false, 'Error:Returning is not reset');  
//   assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning is not reset');
// });

// /* ---------------------- RECREATING THE DROPPED TABLE ---------------------- */

// const initialSetup2 = `CREATE TABLE public.dropthis("_id" serial PRIMARY KEY,"username" VARCHAR ( 150 ) NULL,"email" VARCHAR ( 255 ) NULL)WITH (OIDS=FALSE);`
// const tableToDrop = await dorm.raw(initialSetup2);

// /* -------------------------------------------------------------------------- */
// /*                                 Join Method                                */
// /* -------------------------------------------------------------------------- */

// let fromTry:any;
// try{
//   fromTry = await dorm
//   .select()
//   .from('people')
//   .join('people_in_films')
//   .on('people._id = people_in_films.person_id');
// }
// catch(err){
//   console.log('Error:', err);
// }

// const fromRaw = await dorm.rawrr(`SELECT * FROM people LEFT OUTER JOIN people_in_films ON people._id = people_in_films.person_id`);

// /* ---------------------------- SINGLE JOIN TEST ---------------------------- */

// Deno.test(`Query completion for single Join in JOIN method:`,  () => {
//   assertEquals(Array.isArray(fromTry.rows), true , 'JOIN query is not completed')
// });

// Deno.test(`dORM query vs raw query for single Join in JOIN method:`,  () => {
//   assertEquals(fromRaw.rows, fromTry.rows, 'JOIN query and RAW query should be equal.')
// });

// const multiJoinQuery1: any = await dorm
// .select()
// .from('people')
// .join('people_in_films')
// .on('people._id = people_in_films.person_id')
// .join('films')
// .on('people_in_films.film_id = films._id')
// .then((data:any)=> {
//   return data.rows;
// })
// .catch ((err:any) => {
//   console.log('Error:', err)
// })

// const fromRaw2 = await dorm.rawrr(`SELECT * FROM people LEFT OUTER JOIN "people_in_films" ON people._id = "people_in_films".person_id LEFT OUTER JOIN films ON "people_in_films".film_id = films._id`);


// /* --------------------------- MULTIPLE JOIN TEST --------------------------- */

// Deno.test(`Query completion for two Joins in JOIN method:`,  () => {
//   assertEquals(Array.isArray(multiJoinQuery1), true , 'JOIN query is not completed')
// });

// Deno.test(`dORM query vs raw query for two Joins in JOIN method:`,  () => {
//   assertEquals(fromRaw2.rows, multiJoinQuery1, 'JOIN query and RAW query should be equal.')
// });