import { Client, Pool, PoolClient } from '../deps.ts';
import { template } from './sql-template.ts';

const config =
  'postgres://jkwfgvzj:lB9v6K93eU1bjY75YaIzW3TnFMN2PlLF@ziggy.db.elephantsql.com:5432/jkwfgvzj';

const pool = new Pool(config, 3);

/**
 * QUERY BUILDER
 */

interface info {
  method: null | string;
  select: null | string;
  delete: null | string;
  insert: null | string;
  update: null | string;
  from: null | string;
  where: null | string;
  str: null | string;
}

class Dorm {
  info: info = {
    method: null,
    select: null,
    from: null,
    where: null,
    delete: null,
    str: null,
  };

  error() {
    throw 'error';
  }

  select(arg: string) {
    this.info.select = arg;
    return this;
  }

  from(arg: string) {
    this.info.from = arg;
    return this;
  }

  then(arg: string) {
    let result: string;
    for (const status of info) {
      if (info[status]) {
        result.concat(status);
        result.concat(info[status]);
      }
    }

    return result;
  }

  public async query(str: string) {
    // queries DB
    const client: PoolClient = await pool.connect();
    const dbResult = await client.queryObject(str);
    client.release();
    return dbResult;
  }
}

const dorm = new Dorm();

const testQuery = await dorm
  .select('*')
  .from('people')
  .then((res) => console.log(res.rows));

console.log(
  'My Test Query:',
  testQuery //.executeQuery('SELECT * FROM people')
);
