import { Dorm } from '../lib/draft.ts';
import { assertEquals, assertNotEquals} from "../deps.ts";
import {url} from './test_url.ts'

/*----------------- TESTING SCOPE -----------------*/

/*
* @basic_cases {Query Completion, Data update,}
* @edge_cases {Invalid strings, multiple methods, postgre error return, error handling}
*/
const database = url; // add your url here
const dorm = new Dorm(database);

/*------------ CREATING TESTING ID------------*/
var updateId = Math.floor(Math.random()*40);


/* -------------------------------------------------------------------------- */
/*                      MAKING INITIAL QUERIES FOR TESTS                      */
/* -------------------------------------------------------------------------- */

const initialSetup1 = await dorm
.insert([
  {
    'username':'Golden_Retreiver',
    'nickname': 'golDenR',
    'email':'iamagooddog@dogs.com',
    'created_on': 'NOW()'
  },
  {
    'username':'Superman',
    'nickname':'IamnotHuman',
    'email':'superman@superman.com',
    'created_on': 'NOW()'
  },
  {
    'username':'MrBing',
    'nickname':'BingbingBing',
    'email':'chandlerbing@bings.com',
    'created_on': 'NOW()'
  },
  {
    'username':'Golden_Retreiver',
    'nickname': 'golDenR',
    'email':'iamagooddog@dogs.com',
    'created_on': 'NOW()'
  },
  {
    'username':'Superman',
    'nickname':'IamnotHuman',
    'email':'superman@superman.com',
    'created_on': 'NOW()'
  },
  {
    'username':'MrBing',
    'nickname':'BingbingBing',
    'email':'chandlerbing@bings.com',
    'created_on': 'NOW()'
  }
])
.from('users')
.returning()
.then((data:any) => data.rows)
.catch(e => e);

const initialSetup2 = `CREATE TABLE public.dropthis("_id" serial PRIMARY KEY,"username" VARCHAR ( 150 ) NULL,"email" VARCHAR ( 255 ) NULL)WITH (OIDS=FALSE);`
const tableToDrop = await dorm.raw(initialSetup2);

const initialSetup3 = `INSERT INTO 
post
(posts, comments, likes , created_on)
VALUES
('dORM', 'dORM is an amazing deno framework', 100, NOW()),
('dorm Member 1', 'Han', 20, NOW()),
('dorm Member 2', 'Hanji', 30, NOW()),
('dorm Member 3', 'Myo', 50, NOW()),
('dorm Member 4', 'Nick', 70, NOW()),
('dorm Member 5', 'Jessica', 0, NOW());`
const insertToUser = await dorm.raw(initialSetup3);


/* -------------------------------------------------------------------------- */
/*                                SELECT METHOD                               */
/* -------------------------------------------------------------------------- */

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
// const invalidSelect = await dorm
// .select()
// .from('profile')
// .where('user_id=1')
// .then((data: any) => {
//   return data.rows;
// }).catch((e)=> {return false})

// Deno.test(`all queries to be valid in "SELECT" method:`,() => {
//   assertEquals(invalidSelect, false, `Error:INVALID query found!!!! It should  return an error for invalid query request from Postgres.`) 
// })
Deno.test(`single-column query in "SELECT" method:`, () => {
  const tableName = 'userprofile';
  const condition = 'user_id = 2'
  
  const test = dorm.select().from('userprofile').where('user_id = 2');
  assertEquals(test.info.action.type , 'SELECT', `Error:type is not updated to SELECT`);
  assertEquals(test.info.action.columns , '*', `Error:column/columns are updated to *`);
  assertEquals(test.info.action.table , tableName, `Error:table is not updated to ${tableName}`);
  assertEquals(test.info.filter.where , true, `Error:where is not updated to true`);
  assertEquals(test.info.filter.condition ,condition, `Error:condition is not updated to ${condition}`);
  
  
  /*----------------RESETTING INITIAL VALUES----------------*/
  const testQuery = test.toString();
  
  assertEquals(testQuery , `SELECT * FROM userprofile WHERE user_id = 2`, 'Error:Querybuilder is returning INVALID query string!!');
  assertEquals(test.info.action.type , null, 'Error:Type is not reset after query');
  assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset after query');
  assertEquals(test.info.action.table , null, 'Error:Table is not reset after query');
  assertEquals(test.info.filter.where , false, `Error:where is not reset after query`);
  assertEquals(test.info.filter.condition , null, `Error:condition is not reset after query`);
})

Deno.test(`multiple-columns query in "SELECT" method:`,   () => {
  const columnName = 'username, email';
  const tableName = 'userprofile';
  const condition = 'user_id = 1'
  
  const test =  dorm.select(columnName).from(tableName).where(condition);
  assertEquals(test.info.action.type , 'SELECT', 'Error:Type is not updated to SELECT');
  assertEquals(test.info.action.columns , columnName, `Error:column/columns are updated to ${columnName}`);
  assertEquals(test.info.action.table , tableName, `Error:table is not updated to ${tableName}`);
  assertEquals(test.info.filter.where , true, `Error:where is not updated to true`);
  assertEquals(test.info.filter.condition , `${condition}`, `Error:condition is not updated to ${condition}`);
  
  /*----------------RESETTING INITIAL VALUES----------------*/
  const testQuery = test.toString();
  
  assertEquals(testQuery , `SELECT username, email FROM userprofile WHERE user_id = 1`, 'Error:Querybuilder is returning INVALID query string!!');
  assertEquals(test.info.action.type , null, 'Error:Type is not reset after query');
  assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset');
  assertEquals(test.info.action.table , null, 'Error:Table is not reset after query');
  assertEquals(test.info.filter.where , false, `Error:where is not reset after query`);
  assertEquals(test.info.filter.condition , null, `Error:condition is not reset after query`);
})

// const edgeCase1 = await dorm
// .select()
// .delete()
// .from('userprofile')
// .then((data: any) => {
//   return data;
// })
// .catch(error => {
//   console.log('This is error:',error)
//   return console.log('from edge case 1:',error);
// });

// Deno.test(`multiple actions called in "SELECT" method:`,() => {
//   assertEquals(edgeCase1 , 'No multiple actions', `Error:only one action/method should be allowed in 'SELECT' method`);
// })

/* -------------------------------------------------------------------------- */
/*                                INSERT METHOD                               */
/* -------------------------------------------------------------------------- */

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

// const invalidInsert = await dorm
// .insert([{'user':'newDogs'}])
// .from('profile')
// .where('user_id=1')
// .then((data: any) => {
//   return data.rows;
// }).catch((e)=> {return e})

// Deno.test(`all invalid queries should not work in "INSERT" method:`,() => {
//   assertEquals(invalidInsert, 'No multiple actions', `Error:INVALID query found!!!! It should  return an error for invalid query request from Postgres.`)
// })
Deno.test(`single-row query in "INSERT" method:`,  () => {
  const columnName = [{'username':'singleLady'}];
  const tableName = 'users';
  const returning = '*'
  const test = dorm
  .insert(columnName)
  .from(`${tableName}`)
  .returning(returning);
  // console.log('test.info.action.values: ',test.info.action.values);
  assertEquals(test.info.action.type , 'INSERT', `Error:type is not updated to SELECT`);
  assertEquals(test.info.action.values , `('singleLady')`, `Value is not updated to 'singleLady'`);
  assertEquals(test.info.action.table , tableName, `Error:table is not updated to ${tableName}`);
  assertEquals(test.info.action.columns , 'username', `Error:column/columns are updated to ${columnName}`);
  
  /*----------------RESETTING INITIAL VALUES----------------*/
  test.toString();
  // console.log('after rest:', test.info);
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
  const test = dorm
  .insert(columnNames)
  .from(tableName)
  // .returning();
  // console.log('test.info.action.values: ',test.info.action.values);
  assertEquals(test.info.action.type , 'INSERT', 'Type is not updated to INSERT');
  assertEquals(test.info.action.columns , 'username, password, email, created_on', `Columns are not updated to username`);
  assertEquals(test.info.action.values , `('Golden_Retreiver', 'golDenR', 'iamagooddog@dogs.com', 'NOW()'), ('Superman', 'IamnotHuman', 'superman@superman.com', 'NOW()'), ('MrBing', 'BingbingBing', 'chandlerbing@bings.com', 'NOW()')`, `Value is not updated to ('Golden_Retreiver', 'golDenR', 'iamagooddog@dogs.com', 'NOW()'), ('Superman', 'IamnotHuman', 'superman@superman.com', 'NOW()'), ('MrBing', 'BingbingBing', 'chandlerbing@bings.com', 'NOW()')`);
  assertEquals(test.info.action.table , tableName, `Error:table is not updated to ${tableName}`);
  
  /*----------------RESETTING INITIAL VALUES----------------*/
  test.toString();
  // console.log('after rest:', test.info);
  assertEquals(test.info.action.type , null, 'Error:Type is not reset after query');
  assertEquals(test.info.action.columns , '*', 'Error:Columns are not reset after query');
  assertEquals(test.info.action.table , null, 'Error:Table is not reset after query');
  assertEquals(test.info.action.values , '', 'Error:Value is not reset after query');
});

// Deno.test(`multiple actions called in "INSERT" method:`,() => {
//   assertEquals(edgeCase1 , 'No multiple actions', `Error:only one action/method should be allowed in 'INSERT' method`);
// });



/* -------------------------------------------------------------------------- */
/*                                 DROP METHOD                                */
/* -------------------------------------------------------------------------- */

const idropThis = await dorm
.drop()
.from('dropthis')
// .returning()
.then((data:any)=>{
  return data.rows;
}).catch(e => e);

// console.log('idropThis', idropThis);

Deno.test(`all queries to be valid in "DROP" method:`, ()=> {
  const tableName = 'dropthis';
  const test = dorm
  .drop()
  .from(tableName)
  .returning();
  assertEquals(idropThis,[],'Error:INVALID query found!!!! It should  return an error for invalid query request from Postgres.');
  assertEquals(test.info.action.type , 'DROP', 'Error:Type should be updated to DROP');
  assertEquals(test.info.action.table , tableName, `Error:Table should be updated to ${tableName}`);
  assertEquals(test.info.returning.active , true, 'Error:Returning should be updated to true');  
  
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
});


// Deno.test(`all queries to be valid in "DELETE" method:`, ()=> {
//   assertEquals(edgeCase1, 'No multiple actions','Error:INVALID query found!!!! It should  return an error for invalid query request from Postgres.');
// });

/* -------------------------------------------------------------------------- */
/*                                UPDATE METHOD                               */
/* -------------------------------------------------------------------------- */

// const invalidUpdate = await dorm
// .update({'user':'newDogs'})
// .from('profile')
// .where('user_id>1')
// .returning()
// .then((data: any) => {
// })
// .catch((e)=> {return false}) 
// Deno.test(`all queries to be valid in "UPDATE" method:`,() => {
//   assertEquals(invalidUpdate, false, `Error:INVALID query found!!!! It should  return an error for invalid query request from Postgres.`)
// })
const testUpdateQuery1 = await dorm
.select()
.from('userprofile')
.where(`user_id=${updateId}`)
.then((data: any) => {
  
  return data.rows;
}).catch(e => e);

const updateQuery = await dorm
.update({'username':'newDogs', 'password': 'iLoveDogs'}).where(`user_id = ${updateId}`)
.from('userprofile')
.returning()
.then((data: any) => {
  return data;
}).catch(e => e);


Deno.test(`a single-row query in "UPDATE" method:`, () => {
  const test = dorm.update({'username':'newDogs', 'password': 'iLoveDogs'}).where(`user_id = ${updateId+1}`)
  .from('userprofile')
  .returning('username')
  assertNotEquals(updateQuery, testUpdateQuery1 , 'Error: the method should work more than one row');
  assertEquals(test.info.action.type , 'UPDATE', 'Error:Type is not updated to UPDATE');
  assertEquals(test.info.action.columns , `username = 'newDogs', password = 'iLoveDogs'`, `Error:Columns are not updated to username = 'newDogs', password = 'iLoveDogs'`);
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


const testUpdateQuery2 = await dorm
.select()
.from('userprofile')
.where(`user_id <= ${updateId}`)
.then((data: any) => {
  return data.rows;
}).catch(e => e);

const multipleRowsQuery = await dorm
.update({'username':'Dogs', 'password': 'ihave8Dogs'})
.from('userprofile')
.where(`user_id <= ${updateId}`)
.returning()
.then((data: any) => {
  return data;
}).catch(e => e);

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
}).catch(e => e);

const allRowsUpdateQuery = await dorm
.update({'username':'restarted', 'password': 'iamADog'})
.from('userprofile')
.returning()
.then((data: any) => {
  return data;
}).catch(e => e);
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


// Deno.test(`multiple actions called in "UPDATE" method:`,() => {
//   assertEquals(edgeCase1 , 'No multiple actions', `Error:only one action/method should be allowed in 'UPDATE' method`);
// });

/* -------------------------------------------------------------------------- */
/*                                DELETE METHOD                               */
/* -------------------------------------------------------------------------- */

// const invalidDelete = await dorm
// .delete()
// .from('users')
// .where(`user_id < 0`)
// .returning()
// .then((data:any)=> {
//   return data.rows;
// })
// .catch((error)=> {
//   return error;
// });
Deno.test(`all queries to be valid in "DELETE" method:`, ()=> {
  const tableName = 'users';
  const condition = `user_id = ${updateId+2}`
  const test = dorm
  .delete()
  .from(tableName)
  .where(condition)
  .returning();
  // console.log('test from all queries:',test.info);
  // assertEquals(invalidDelete, [],'Error:INVALID query found!!!! It should  return an error for invalid query request from Postgres.');
  
  assertEquals(test.info.action.type , "DELETE", 'Error:Type should be updated to DELETE');
  assertEquals(test.info.action.table , tableName, `Error:Table should be updated to ${tableName}`);
  assertEquals(test.info.filter.where , true, `Error:where should be updated to true`);
  assertEquals(test.info.filter.condition , condition, `Error:condition should be updated to ${condition}`);
  assertEquals(test.info.returning.active , true, 'Error:Returning should be updated');  
  assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning should be pdated');
  
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
.then((data:any)=> {
  return data.rows;
}).catch(e => e); // []

console.log('deleteOneQuery:', deleteOneQuery);
const testDeleteQuery1 = await dorm
.select()
.from('userprofile')
.where(`user_id = ${updateId}`)
.then((data: any) => {
  return data.rows;
}).catch(e => e); // []


Deno.test(`single-row query in "DELETE" method:`, ()=> {
  const tableName = 'userprofile';
  const condition = `user_id = ${updateId+1}`
  const test = dorm
  .delete()
  .from(tableName)
  .where(condition)
  .returning();
  // console.log('deleteOneQuery', deleteOneQuery);
  // console.log('test.info from single-row:',test.info)
  assertEquals(Array.isArray(deleteOneQuery), true ,'Error:Delete query is not completed!');
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
}).catch(e => e);
const testDeleteQuery2 = await dorm
.select()
.from('userprofile')
.where(`user_id = ${updateId+1}`)
.then((data: any) => {
  return data.rows;
}).catch(e => e);

Deno.test(`multiple-rows query in "DELETE" method:`, ()=> {
  const tableName = 'users';
  const condition = `user_id > ${updateId+2}`
  const test = dorm
  .delete()
  .from(tableName)
  .where(condition)
  .returning();
  // console.log('test.info from multiple-rows query:',test.info)
  assertNotEquals(testDeleteQuery2, deleteMultipleQuery,'Error:Multiple DELETE query is not completed!');
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
.from('users')
.returning()
.then(data=> {
  return data;
}).catch(e => e);
console.log('deleteAllQuery:', deleteAllQuery);
const testDeleteQuery3 = await dorm
.select()
.from('users')
.then((data: any) => {
  return data.rows;
}).catch(e => e);

Deno.test(`all rows query in "DELETE" method:`, ()=> {
  const tableName = 'users';
  const condition = ``
  const test = dorm
  .delete()
  .from(tableName)
  .where(condition)
  .returning();
  console.log("all rows test.info:", test.info);
  assertEquals(deleteAllQuery,'No delete without where (use deleteAll to delete all rows)','Error:Multiple DELETE query is not completed!');
  assertEquals(test.info.action.type , 'DELETE', 'Error:Type is not updated to DELETE');
  assertEquals(test.info.action.table , tableName, 'Error:Table is not updated to userprofile');
  assertEquals(test.info.filter.where , true, `Error:where is not updated to true`);
  assertEquals(test.info.filter.condition , condition, `Error:condition is not updated to ${condition}`);
  assertEquals(test.info.returning.active , true, 'Error:Returning is not updated');  
  assertEquals(test.info.returning.columns , '*', 'Error:Columns in Returning is not reset');
})

// Deno.test(`multiple actions called in "DELETE" method:`,() => {
//   assertEquals(edgeCase1 , 'No multiple actions', `Error:only one action/method should be allowed in 'DELETE' method`);
// });



/* -------------------------------------------------------------------------- */
/*                                 Join Method                                */
/* -------------------------------------------------------------------------- */

let fromTry:any;
try{
  fromTry = await dorm
  .select()
  .from('people')
  .join('people_in_films')
  .on('people._id = people_in_films.person_id');
}
catch(err){
  console.log('Error:', err);
}

console.log('Single Join Query: ', `SELECT * FROM people LEFT OUTER JOIN people_in_films ON people._id = people_in_films.person_id`);
// console.log('fromTry: ', fromTry.rows[fromTry.rows.length-1]);
// QUERY COMPLETED BUT THE RETURNING DATA IS NOT EQUAL

const fromRaw = await dorm.rawrr(`SELECT * FROM people LEFT OUTER JOIN people_in_films ON people._id = people_in_films.person_id`);
// console.log('fromRaw: ', fromRaw.rows[fromRaw.rows.length-1]);

Deno.test(`Query completion for single Join in JOIN method:`,  () => {
  assertEquals(Array.isArray(fromTry.rows), true , 'JOIN query is not completed')
});

Deno.test(`dORM query vs raw query for single Join in JOIN method:`,  () => {
  assertEquals(fromRaw.rows, fromTry.rows, 'JOIN query and RAW query should be equal.')
});

const multiJoinQuery1: any = await dorm
.select()
.from('people')
.join('people_in_films')
.on('people._id = people_in_films.person_id')
.join('films')
.on('people_in_films.film_id = films._id')
.then((data:any)=> {
  return data.rows;
})
.catch ((err) => {
  console.log('Error:', err)
})
console.log('multiJoinQuery1: ', multiJoinQuery1[multiJoinQuery1.length-1]);

const fromRaw2 = await dorm.rawrr(`SELECT * FROM people LEFT OUTER JOIN "people_in_films" ON people._id = "people_in_films".person_id LEFT OUTER JOIN films ON "people_in_films".film_id = films._id`);

console.log('fromRaw2: ', fromRaw2.rows[fromRaw2.rows.length-1]);


Deno.test(`Query completion for two Joins in JOIN method:`,  () => {
  assertEquals(Array.isArray(multiJoinQuery1), true , 'JOIN query is not completed')
});

Deno.test(`dORM query vs raw query for two Joins in JOIN method:`,  () => {
  assertEquals(fromRaw2.rows, multiJoinQuery1, 'JOIN query and RAW query should be equal.')
});