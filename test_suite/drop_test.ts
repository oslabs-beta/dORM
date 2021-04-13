import { Dorm } from '../lib/query-builder.ts';
import { assertEquals, assertNotEquals } from '../deps.ts';
import { config } from '../deps.ts';
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

const env = config();
// create .env file and add your database inside it. using followin variables USERNAME, PASSWORD, SERVER
const URL = `postgres://${env.USERNAME}:${env.PASSWORD}@${env.SERVER}.db.elephantsql.com:5432/${env.USERNAME}`;

const database = URL; // Or you can add your url here
const dorm = new Dorm(database);

/*------------ CREATING TESTING ID------------*/
var updateId = Math.floor(Math.random() * 35);

/*------------ TESTING DROP METHOD ------------*/
const idropThis = await dorm
  .drop()
  .from('dropthis')
  .then((data: any) => {
    return data.rows;
  })
  .catch((e) => e);

/* -------------------------------------------------------------------------- */
/*                           VALIDATION TEST IN DROP                          */
/* -------------------------------------------------------------------------- */

Deno.test(`all queries to be valid in "DROP" method:`, () => {
  const tableName = 'dropthis';
  const test = dorm.drop().from(tableName).returning();
  assertEquals(
    idropThis,
    [],
    'Error:INVALID query found!!!! It should  return an error for invalid query request from Postgres.'
  );
  assertEquals(
    test.info.action.type,
    'DROP',
    'Error:Type should be updated to DROP'
  );
  assertEquals(
    test.info.action.table,
    tableName,
    `Error:Table should be updated to ${tableName}`
  );
  assertEquals(
    test.info.returning.active,
    true,
    'Error:Returning should be updated to true'
  );

  /* ------------------------ RESETTING INITIAL VALUES ------------------------ */
  test.toString();
  assertEquals(test.info.action.type, null, 'Error:Type is not reset');
  assertEquals(test.info.action.columns, '*', 'Error:Columns are not reset');
  assertEquals(test.info.action.values, '', 'Error:Values are not reset');
  assertEquals(test.info.action.table, null, 'Error:Table is not reset');
  assertEquals(
    test.info.filter.where,
    false,
    `Error:where is not reset after query`
  );
  assertEquals(
    test.info.filter.condition,
    null,
    `Error:condition is not reset after query`
  );
  assertEquals(
    test.info.returning.active,
    false,
    'Error:Returning is not reset'
  );
  assertEquals(
    test.info.returning.columns,
    '*',
    'Error:Columns in Returning is not reset'
  );
});

/* ---------------------- RECREATING THE DROPPED TABLE ---------------------- */

const initialSetup2 = `CREATE TABLE public.dropthis("_id" serial PRIMARY KEY,"username" VARCHAR ( 150 ) NULL,"email" VARCHAR ( 255 ) NULL)WITH (OIDS=FALSE);`;
const tableToDrop = await dorm.raw(initialSetup2);
