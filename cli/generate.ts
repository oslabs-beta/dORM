import { config } from '../deps.ts';
import { Pool, PoolClient } from '../deps.ts';

const env = config();

console.log(env.databaseURL);
