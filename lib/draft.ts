/**
 * DATABASE MODEL----------------------------------------------------------
 */
import { Client, Pool, PoolClient } from '../deps.ts';
// import { template } from './sql-template.ts';

const config =
  'postgres://jkwfgvzj:lB9v6K93eU1bjY75YaIzW3TnFMN2PlLF@ziggy.db.elephantsql.com:5432/jkwfgvzj';

const pool = new Pool(config, 3);

/**
 * QUERY BUILDER------------------------------------------------------------
 */
interface Info {
  action: {
    type: string;
    table: null | string;
    columns: null | string | string[];
    values: null | string | string[];
  };
  filter: {
    where: boolean;
    // column: null | string;
    // operator: null | string;
    // value: null | string | number;
    condition: null | string;
  };
}

class Dorm {
  info: Info;

  constructor() {
    this.info = {
      action: {
        type: '',
        table: null,
        columns: null,
        values: null,
      },
      filter: {
        where: false,
        // column: null,
        // operator: null,
        // value: null,
        condition: null,
      },
    };
  }

  error() {
    throw 'error';
  }

  select(arg: string) {
    if (this.info.action.type) throw 'error';
    this.info.action.type = 'SELECT';
    this.info.action.columns = arg;
    return this;
  }

  table(arg: string) {
    this.info.action.table = arg;
    return this;
  }

  from = this.table;

  where(arg: string) {
    this.info.filter.where = true;
    this.info.filter.condition = arg;
    return this;
  }

  async then(callback: (arg: unknown) => unknown): Promise<unknown> {
    const action = this.info.action.type;
    const filter = this.info.filter.where;
    //if(!action){throw new Error}

    let queryTemplate = template(action)!;
    if (filter) queryTemplate = queryTemplate.concat(` ${template('WHERE')}`);

    const result = await this.query(queryTemplate);

    const promise = new Promise<unknown>((resolve, reject) => {
      try {
        resolve(callback(result));
      } catch (e) {
        reject(e);
      }
    });

    return promise;
  }

  async query(str: string) {
    // queries DB
    const client: PoolClient = await pool.connect();
    const dbResult = client.queryObject(str);
    client.release();
    return dbResult; // promise object
  }
}

const dorm = new Dorm();

/**
 *  TEMPLATE ----------------------------------------------------------------
 */
function template(type: string) {
  switch (type) {
    case 'SELECT':
      return `SELECT ${dorm.info.action.columns} FROM ${dorm.info.action.table}`;
    case 'WHERE':
      return `WHERE ${dorm.info.filter.condition}`; //${dorm.info.filter.column} ${dorm.info.filter.operator} ${dorm.info.filter.value}`;
    default:
      return;
  }
}

/**
 * USER------------------------------------------------------------------------
 */
const testQuery = await dorm
  .select('*')
  .from('people')
  .where('_id = 1')
  .then((data: any) => {
    console.log('first then');
    return data.rows[0];
  })
  .then((data) => {
    console.log('promise then: ', data);
    return data;
  });
console.log('My Test Query:', testQuery);
