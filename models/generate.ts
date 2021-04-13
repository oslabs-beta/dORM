import { config } from '../deps.ts';
import { query, poolConnect } from '../lib/db-connector.ts';

const env = config();

const url = env.dorm_databaseURL;

poolConnect(url);

const modelQuery = Deno.readTextFileSync('models/relationships.sql');

const firstQuery = await query(modelQuery);

console.log(firstQuery.rows);

// This is how you stringify
// const tableNames = JSON.stringify(firstQuery.rows);

/**
 * Make directory in the root folder and create model files inside 'dorm' directory
 */
// Deno.mkdirSync('./dorm');
// Deno.writeTextFileSync('dorm/model.ts', tableNames);
