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
  returning: {
    active: boolean;
    columns: string | string[];
  };
}

class Dorm {
  info: Info;

  constructor() {
    this.info = {
      action: {
        type: '',
        table: null,
        columns: '*',
        values: null,
      },
      filter: {
        where: false,
        // column: null,
        // operator: null,
        // value: null,
        condition: null,
      },
      returning: {
        active: false,
        columns: '*',
      },
    };
  }

  error() {
    throw 'error';
  }

  select(arg?: string) {
    if (this.info.action.type) throw 'error';
    this.info.action.type = 'SELECT';
    if (arg) this.info.action.columns = arg;
    return this;
  }

  delete() {
    this.info.action.type = 'DELETE';
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

  returning(arg?: string) {
    this.info.returning.active = true;
    if (arg) this.info.returning.columns = arg;
    return this;
  }

  async then(callback: (data: unknown) => unknown) {
    const action = this.info.action.type;
    const filter = this.info.filter.where;
    const returning = this.info.returning.active;

    let queryTemplate = template(action)!;
    if (filter) queryTemplate += ` ${template('WHERE')}`;
    if (returning) queryTemplate += ` ${template('RETURNING')}`;

    console.log('QUERY STRING: ', queryTemplate);

    const result = await this.query(queryTemplate);

    // clear info future function
    this.info = {
      action: {
        type: '',
        table: null,
        columns: '*',
        values: null,
      },
      filter: {
        where: false,
        // column: null,
        // operator: null,
        // value: null,
        condition: null,
      },
      returning: {
        active: false,
        columns: '*',
      },
    };

    const promise = new Promise((resolve, reject) => {
      resolve(callback(result));
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

export const dorm = new Dorm();

/**
 *  TEMPLATE ----------------------------------------------------------------
 */
// interface Template {
//   [propName: string]: string;
// }
function template(type: string) {
  switch (type) {
    case 'SELECT':
      return `SELECT ${dorm.info.action.columns} FROM ${dorm.info.action.table}`;
    case 'WHERE':
      return `WHERE ${dorm.info.filter.condition}`; //${dorm.info.filter.column} ${dorm.info.filter.operator} ${dorm.info.filter.value}`;
    case 'DELETE':
      return `DELETE FROM ${dorm.info.action.table}`;
    case 'RETURNING':
      return `RETURNING ${dorm.info.returning.columns}`;
    default:
    // return;
  }
}
