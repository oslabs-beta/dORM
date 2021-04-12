import { config } from '../deps.ts';
import { query, poolConnect } from '../lib/db-connector.ts';

const env = config();

const url = env.dorm_databaseURL;

poolConnect(url);
// const decoder = new TextDecoder('utf-8');
const modelQuery = Deno.readTextFileSync('models/relationships.sql');
// console.log(modelQuery);
// First query to retrive all the table names
const firstQuery = await query(modelQuery);

const tableNames = firstQuery.rows;
console.log(tableNames);

// Second query to grab data types of the columns for each table

// console.log(test);
