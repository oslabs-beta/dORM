import {Dorm } from '../lib/draft.ts';
import { assertEquals, assertNotEquals, Pool, PostgresError, PoolClient } from "../deps.ts";
import { template } from '../lib/sql-template.ts';
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

/*------------ TESTING SELECT METHOD ------------*/
const selectQuery = await dorm.select()
.from('userprofile')
.where('user_id=1').then((data: any) => {
  // console.log('Returned data:',data.rows);
  return data.rows;
})
Deno.test(`Is "SELECT" method working:`, () => {
  assertNotEquals(selectQuery,undefined, 'Output is not undefined.')
  // function queryResult(query: Userprofile):number {
  //   let length = 0;
  //   for(const properties in query){
  //     length+= 1;
  //   }
  //   return length;
  // }
  // queryResult(selectQuery);
  // console.log(queryResult);
  // assertEquals(queryResult[0]["user_id"], "1", 'Output has at least one row');
});
Deno.test(`Is single column selecting in "SELECT" working:`,  async () => {
  const test = await dorm.select('username').from('userprofile').where('user_id = 2').then((data: any) => {
    return data.rows;
  });
  // assertEquals(test.info.action.type , 'SELECT', 'Type is changed to SELECT');
  // assertEquals(test.info.action.columns , 'username', 'column is changed to username');
  // assertEquals(test.info.action.table , 'userprofile', 'table is changed to userprofile');
  // assertEquals(test.info.action.type , null, 'Type is reset');
  // assertEquals(test.info.action.columns , '*', 'column is reset');
  // assertEquals(test.info.action.table , null, 'table is reset');
})

Deno.test(`Is multiple column selecting in "SELECT" working:`,  async () => {
  const test =  await dorm.select('username, email').from('userprofile').where('user_id = 3').then((data: any) => {
    return data.rows;
  });
  // assertEquals(test.info.action.type , 'SELECT', 'Type is changed to SELECT');
  // assertEquals(test.info.action.columns , 'username, email', 'column is changed to username, email');
  // assertEquals(test.info.action.table , 'userprofile', 'table is changed to userprofile');
  // assertEquals(test.info.action.type , null, 'Type is reset');
  // assertEquals(test.info.action.columns , '*', 'column is reset');
  // assertEquals(test.info.action.table , null, 'table is reset');
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
  assertEquals(test.info.action.type , 'INSERT', 'Type is changed to INSERT');
  assertEquals(test.info.action.columns , 'username', `column is changed to 'username'`);
  assertEquals(test.info.action.values , `('singleLady')`, `value is changed to 'singleLady'`);
  assertEquals(test.info.action.table , 'userprofile', 'table is changed to userprofile');
  // the dorm class is not reset
  test.info = {
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
});

Deno.test(`Is multiple rows inserting in "INSERT" working:`,  () => {
  const newTest =  dorm.insert([{'username':'tripleShot'}, {'username': 'halo'}]).from('userprofile');
  // console.log('from test:',newTest.info.action.values);
  assertEquals(newTest.info.action.type , 'INSERT', 'Type is changed to INSERT');
  assertEquals(newTest.info.action.columns , 'username', `column is changed to username`);
  assertEquals(newTest.info.action.values , `('tripleShot'), ('halo')`, `value is changed to 'tripleShot, halo'`);
  assertEquals(newTest.info.action.table , 'userprofile', 'table is changed to userprofile');
});


/*------------ TESTING UPDATE METHOD ------------*/

const testUpdateQuery1 = await dorm.select()
.from('userprofile')
.where('user_id=1').then((data: any) => {
  // console.log('Returned data:',data.rows);
  return data.rows;
})
const updateQuery = await dorm.update({'username':'newDogs', 'password': 'iLoveDogs'}).where('user_id = 1')
.from('userprofile')
.returning().then((data: any) => {
  // console.log(data.rows);
   return data;
 })

 Deno.test(`Is "UPDATE" method working for one row update:`, () => {
  assertNotEquals(updateQuery, undefined, 'Output is not undefined.')
  assertNotEquals(updateQuery, testUpdateQuery1 , 'Output has at least one row');
});

const testUpdateQuery2 = await dorm.select()
.from('userprofile')
.where('user_id <= 1').then((data: any) => {
  // console.log('Returned data:',data.rows);
  return data.rows;
})

const eightRowsUpdateQuery = await dorm.update({'username':'Dogs', 'password': 'ihave8Dogs'}).where('user_id <= 8')
.from('userprofile')
.returning().then((data: any) => {
  // console.log(data.rows);
   return data;
 })

 Deno.test(`Is "UPDATE" method working for multiple rows update:`, () => {
  assertNotEquals(eightRowsUpdateQuery, testUpdateQuery2, 'Exactly updated 8 rows');
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
  assertNotEquals(allRowsUpdateQuery, testUpdateQuery3, 'The whole table was not updated');
});

/*------------ TESTING DELETE METHOD ------------*/

const deleteOneQuery = await dorm.delete().from('userprofile').where('user_id = 20').returning().then(data=> {
  return data.row[0];
});

const testDeleteQuery1 = await dorm.select()
.from('userprofile')
.where('user_id = 20').then((data: any) => {
  // console.log('Returned data:',data.rows);
  return data.rows;
})

Deno.test(`Is Delete single row working:`, ()=> {
  assertNotEquals(deleteOneQuery, undefined,'Delete is not completed!')
})