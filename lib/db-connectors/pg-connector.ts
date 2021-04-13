import { Pool, PoolClient } from '../../deps.ts';

let pool: Pool;

function poolConnect(url: string) {
  pool = new Pool(url, 3);
}

async function query(str: string, vals?: unknown[]) {
  try {
    const client: PoolClient = await pool.connect();
    let dbResult;

    if (vals && vals.length) {
      dbResult = await client.queryObject({ text: str, args: vals });
    } else {
      dbResult = await client.queryObject(str);
    }

    client.release();
    return dbResult;
  } catch (e) {
    throw e;
  }
}

export { query, poolConnect };
