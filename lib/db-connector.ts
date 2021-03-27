import { Pool, PoolClient } from '../deps.ts';

let pool: Pool;

function poolConnect(url: string) {
  pool = new Pool(url, 3);
}

async function query(str: string) {
  try {
    const client: PoolClient = await pool.connect();
    const dbResult = await client.queryObject(str);
    client.release();
    return dbResult;
  } catch (e) {
    throw e;
  }
}

export { query, poolConnect };
