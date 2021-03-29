import { Dorm } from '../lib/draft.ts';
import { assertEquals, assertNotEquals} from "../deps.ts";
// import { template } from '../lib/sql-template.ts';
// add url in test_url.ts file
import {url} from './test_url.ts'
/*------------ CONNECTING TO DATABASE ------------*/
const database = url;
const dorm = new Dorm(database);
/*------------ INTERFACES FOR TABLES ------------*/
interface Userprofile{
  user_id : number,
  username :string,
  password :string,
  email :string,
  created_on :string,
  last_login :string 
}
interface Info {
  action: {
    type: null | string;
    table: null | string;
    columns: null | string | string[];
    values: string;
  };
  filter: {
    where: boolean;
    condition: null | string;
  };
  returning: {
    active: boolean;
    columns: string | string[];
  };
}
// console.log(dorm);
function toQueryString(arg:any){
  arg.info = {
    action: {
      type: null,
      table: null,
      columns: '*',
      values: '',
    },
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
/*------------ TESTING SELECT METHOD ------------*/
var updateId = Math.floor(Math.random()*35);
/*------------ TESTING SELECT METHOD ------------*/
const selectQuery = await dorm.select()
.from('userprofile')
.where('user_id=1').then((data: any) => {
  // console.log('Returned data:',data.rows);
  return data.rows;
}).catch((e)=> {throw e})
Deno.test(`Is "SELECT" method working:`, () => {
  assertNotEquals(selectQuery,undefined, 'Output is undefined.')
});
Deno.test(`Is single column selecting in "SELECT" working:`, () => {
  const test = dorm.select('username').from('userprofile').where('user_id = 2')/*.then((data: any) => {
    return data.rows;
  })*/;
  assertEquals(test.info.action.type , 'SELECT', 'Type is not changed to SELECT');
  assertEquals(test.info.action.columns , 'username', 'Columns are not changed to username');
  assertEquals(test.info.action.table , 'userprofile', 'Table is not changed to userprofile');
  // reseting the info obj
  toQueryString(test);
  assertEquals(test.info.action.type , null, 'Type is not reset');
  assertEquals(test.info.action.columns , '*', 'Columns are not reset');
  assertEquals(test.info.action.table , null, 'Table is not reset');
})

Deno.test(`Is multiple column selecting in "SELECT" working:`,   () => {
  const test =  dorm.select('username, email').from('userprofile')/*.where('user_id = 3').then((data: any) => {
    return data.rows;
  })*/;
  assertEquals(test.info.action.type , 'SELECT', 'Type is not changed to SELECT');
  assertEquals(test.info.action.columns , 'username, email', 'Columns are not changed to username, email');
  assertEquals(test.info.action.table , 'userprofile', 'Table is not changed to userprofile');
  // reseting the info obj
  toQueryString(test);
  assertEquals(test.info.action.type , null, 'Type is not reset');
  assertEquals(test.info.action.columns , '*', 'Columns are not reset');
  assertEquals(test.info.action.table , null, 'Table is not reset');
})

/*------------ TESTING INSERT METHOD ------------*/

const insertQuery = await dorm.insert([{'username':'newDogs', 'password': 'new99', 'email': 'newdog@dog.com','created_on':'NOW()' }])
.from('userprofile')
.returning().then((data: any) => {
  return data;
})
const insertSelectQuery1 = await dorm.select()
.from('userprofile')
.then((data: any) => {
  // console.log('Returned data:',data.rows);
  return data.rows;
})

Deno.test(`Is "INSERT" method working:`, () => {
  assertNotEquals(insertQuery, undefined, 'Output is not undefined.')
  assertNotEquals(insertSelectQuery1, selectQuery, 'Output is not undefined.')
});

Deno.test(`Is single row inserting in "INSERT" working:`,  () => {
  const test =  dorm.insert([{'username':'singleLady'}]).from('userprofile');
  assertEquals(test.info.action.type , 'INSERT', 'Type is not changed to INSERT');
  assertEquals(test.info.action.columns , 'username', `Column is not changed to 'username'`);
  assertEquals(test.info.action.values , `('singleLady')`, `Value is not changed to 'singleLady'`);
  assertEquals(test.info.action.table , 'userprofile', 'Table is not changed to userprofile');
  // reseting the info obj
  toQueryString(test);
  assertEquals(test.info.action.type , null, 'Type is not reset');
  assertEquals(test.info.action.columns , '*', 'Columns are not reset');
  assertEquals(test.info.action.values , '', 'Values are not reset');
  assertEquals(test.info.action.table , null, 'Table is not reset');
  
});

Deno.test(`Is multiple rows inserting in "INSERT" working:`,  () => {
  const test =  dorm.insert([{'username':'tripleShot'}, {'username': 'halo'}]).from('userprofile');
  // console.log('from test:',newTest.info.action.values);
  assertEquals(test.info.action.type , 'INSERT', 'Type is not changed to INSERT');
  assertEquals(test.info.action.columns , 'username', `Columns are not changed to username`);
  assertEquals(test.info.action.values , `('tripleShot'), ('halo')`, `Value is not changed to 'tripleShot, halo'`);
  assertEquals(test.info.action.table , 'userprofile', 'Table is not changed to userprofile');
  // reseting the info obj
  toQueryString(test);
  assertEquals(test.info.action.type , null, 'Type is not reset');
  assertEquals(test.info.action.columns , '*', 'Columns are not reset');
  assertEquals(test.info.action.values , '', 'Values are not reset');
  assertEquals(test.info.action.table , null, 'Table is not reset');
});


/*------------ TESTING UPDATE METHOD ------------*/

const testUpdateQuery1 = await dorm.select()
.from('userprofile')
.where(`user_id=${updateId}`).then((data: any) => {
  // console.log('Returned data:',data.rows);
  return data.rows;
})
const updateQuery = await dorm.update({'username':'newDogs', 'password': 'iLoveDogs'}).where(`user_id = ${updateId}`)
.from('userprofile')
.returning().then((data: any) => {
  // console.log(data.rows);
  return data;
})

Deno.test(`Is "UPDATE" method working for one row update:`, () => {
  const test = dorm.update({'username':'newDogs', 'password': 'iLoveDogs'}).where(`user_id = ${updateId+1}`)
  .from('userprofile')
  .returning()
  assertNotEquals(updateQuery, undefined, 'Output is not undefined.')
  assertNotEquals(updateQuery, testUpdateQuery1 , 'Output has more than one row');
  assertEquals(test.info.action.type , 'UPDATE', 'Type is not changed to UPDATE');
  assertEquals(test.info.action.columns , `username = 'newDogs', password = 'iLoveDogs'`, `column is not changed to username = 'newDogs', password = 'iLoveDogs'`);
  assertEquals(test.info.action.table , 'userprofile', 'table is not changed to userprofile');
   // reseting the info obj
   toQueryString(test);
   assertEquals(test.info.action.type , null, 'Type is not reset');
   assertEquals(test.info.action.columns , '*', 'Columns are not reset');
   assertEquals(test.info.action.values , '', 'Values are not reset');
   assertEquals(test.info.action.table , null, 'Table is not reset');
  
});

const testUpdateQuery2 = await dorm.select()
.from('userprofile')
.where(`user_id <= ${updateId}`).then((data: any) => {
  // console.log('Returned data:',data.rows);
  return data.rows;
})

const eightRowsUpdateQuery = await dorm.update({'username':'Dogs', 'password': 'ihave8Dogs'})
.from('userprofile')
.where(`user_id <= ${updateId}`)
.returning().then((data: any) => {
  // console.log(data.rows);
  return data;
})

Deno.test(`Is "UPDATE" method working for multiple rows update:`, () => {
  const test = dorm.update({'username':'Dogs', 'password': 'ihave8Dogs'}).where(`user_id <= ${updateId}`)
  .from('userprofile')
  .returning();
  assertNotEquals(eightRowsUpdateQuery, testUpdateQuery2, `Exactly updated ${updateId} rows`);
  assertEquals(test.info.action.type , 'UPDATE', 'Type is not changed to UPDATE');
  // console.log('...................................',test.info.action.columns);
  assertEquals(test.info.action.columns , `username = 'Dogs', password = 'ihave8Dogs'`, `column is not changed to username = 'Dogs', password = 'ihave8Dogs'`);
  assertEquals(test.info.action.table , 'userprofile', 'Table is not changed to userprofile');
  // reseting the info obj
  toQueryString(test);
  assertEquals(test.info.action.type , null, 'Type is not reset');
  assertEquals(test.info.action.columns , '*', 'Columns are not reset');
  assertEquals(test.info.action.table , null, 'Table is not reset');
});

const testUpdateQuery3 = await dorm.select()
.from('userprofile')
.then((data: any) => {
  // console.log('Returned data:',data.rows);
  return data.rows;
})
const allRowsUpdateQuery = await dorm.update({'username':'restarted', 'password': 'iamADog'})
.from('userprofile')
.returning().then((data: any) => {
  // console.log(data.rows);
  return data;
})
Deno.test(`Is "UPDATE" method working for all rows update:`, () => {
  const test = dorm.update({'username':'restarted', 'password': 'iamADog'})
  .from('userprofile')
  .returning();
  assertNotEquals(allRowsUpdateQuery, testUpdateQuery3, 'The whole table was not updated');
  assertEquals(test.info.action.type , 'UPDATE', 'Type is not changed to UPDATE');
  assertEquals(test.info.action.columns , `username = 'restarted', password = 'iamADog'`, `column is not changed to username = 'restarted', password = 'iamADog'`);
  assertEquals(test.info.action.table , 'userprofile', 'Table is not changed to userprofile');
  // reseting the info obj
  toQueryString(test);
  assertEquals(test.info.action.type , null, 'Type is not reset');
  assertEquals(test.info.action.columns , '*', 'Columns are not reset');
  assertEquals(test.info.action.values , '', 'Values are not reset');
  assertEquals(test.info.action.table , null, 'Table is not reset');
  
});

/*------------ TESTING DELETE METHOD ------------*/

const testDeleteQuery1 = await dorm.select()
.from('userprofile')
.where(`user_id = ${updateId}`).then((data: any) => {
  // console.log('Before deleting data:',data.rows);
  return data.rows;
})
const deleteOneQuery1 = await dorm.delete().from('userprofile').where(`user_id = ${updateId}`).returning().then(data=> {
  return data;
});
// console.log(deleteOneQuery)

const testDeleteQuery2 = await dorm.select()
.from('userprofile')
.where(`user_id = ${updateId}`).then((data: any) => {
  // console.log('After deleted data:',data.rows);
  return data.rows;
})

Deno.test(`Is Delete single row working at id ${updateId+1}:`, ()=> {
  const test = dorm.delete()
  .from('userprofile')
  .where(`user_id = ${updateId+1}`).returning();
  assertNotEquals(deleteOneQuery1, undefined,'Delete is not completed!');
  // reseting the info obj
  toQueryString(test)
  assertEquals(test.info.action.type , null, 'Type is not reset');
  assertEquals(test.info.action.columns , '*', 'Column are not reset');
  assertEquals(test.info.action.values , '', 'Values are not reset');
  assertEquals(test.info.action.table , null, 'Table is not reset');
})

const deleteOneQuery2 = await dorm.delete().from('userprofile').where(`user_id = ${updateId}`).returning().then(data=> {
  return data;
});