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
    type: null | string;
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
        type: null,
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

  insert(...arg: unknown[]) {
    this.info.action.type = 'INSERT';

    // IF arg is an Object

    // IF arg is an array

    // IF arg is an nested array

    // IF arg is a single value

    if (Array.isArray(arg)) {
      for (let ele of arg) {
      }
    }
    return this;
  }

  // {id: 1, name: han}

  // {id: 2, name: hanji}

  //insert('hansolo')
  //insert('hansolo', 'handouble', 'hantriple')
  //insert(['hansolo', 'handouble', 'hantriple'])
  //insert([{column:value},{column:value2}])
  //insert({column:value},{column:value2});

  // {0:{promotion_name: 2019 Summer Promotion,
  // discount: 0.15},1:{

  // }}

  /*
  INSERT INTO sales.promotions (
    promotion_name,
    discount,
    start_date,
    expired_date
)
VALUES
    (
        '2019 Summer Promotion',
        0.15,
        '20190601',
        '20190901'
    ),
    (
        '2019 Fall Promotion',
        0.20,
        '20191001',
        '20191101'
    ),
*/

  select(arg?: string) {
    this.info.action.type = 'SELECT';
    if (arg) this.info.action.columns = arg;
    return this;
  }

  delete() {
    this.info.action.type = 'DELETE';
    return this;
  }

  drop(arg?: string) {
    this.info.action.type = 'DROP';
    if (arg) this.info.action.table = arg;
    return this;
  }

  table(arg: string) {
    this.info.action.table = arg;
    return this;
  }
  /**
   * Alias for table method
   */
  from = this.table;
  into = this.table;

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

  // async errorHandler(){
  //   await throw
  // }

  async then(callback: (data: unknown) => unknown) {
    const action = this.info.action.type;
    const filter = this.info.filter.where;
    const returning = this.info.returning.active;

    let queryTemplate = '';
    if (action) queryTemplate = template(action);
    if (filter) queryTemplate += ` ${template('WHERE')}`;
    if (returning) queryTemplate += ` ${template('RETURNING')}`;

    console.log('QUERY STRING: ', queryTemplate);

    const result = await this.query(queryTemplate);

    // clear info future function
    this.info = {
      action: {
        type: null,
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
      try {
        resolve(callback(result));
      } catch (e) {
        reject(e);
      }
    });

    return promise;
  }

  async query(str: string) {
    try {
      // queries DB
      const client: PoolClient = await pool.connect();
      const dbResult = await client.queryObject(str);
      client.release();
      return dbResult; // promise object
    } catch (e) {
      throw e;
    }
  }
}

export const dorm = new Dorm();

/**
 *  TEMPLATE ----------------------------------------------------------------
 */
// interface Template {
//   [propName: string]: string;
// }
function template(type: string): string {
  switch (type) {
    case 'SELECT':
      return `SELECT ${dorm.info.action.columns} FROM ${dorm.info.action.table}`;
    case 'DELETE':
      return `DELETE FROM ${dorm.info.action.table}`;
    case 'DROP':
      return `DROP TABLE ${dorm.info.action.table}`;
    case 'INSERT':
      return `INSERT INTO ${dorm.info.action.table} (${dorm.info.action.columns}) VALUES (${dorm.info.action.values})`;
    case 'WHERE':
      return `WHERE ${dorm.info.filter.condition}`; //${dorm.info.filter.column} ${dorm.info.filter.operator} ${dorm.info.filter.value}`;
    case 'RETURNING':
      return `RETURNING ${dorm.info.returning.columns}`;
    default:
      return '';
  }
}

/**
 * USER------------------------------------------------------------------------
 */
// const testQuery = await dorm
//   .select('*')
//   .from('people')
//   .where('_id = 1')
//   .then((data: any) => {
//     console.log('first then');
//     return data.rows[0];
//   })
//   .then((data) => {
//     console.log('promise then: ', data);
//     return data;
//   });

const testQuery = await dorm
  .select()
  .table('people')
  .then((data: any) => {
    console.log('Our then');
    return data.rows[0];
  })
  .then((data) => {
    console.log('Bult-in then: ', data);
    return data;
  })
  .catch((e) => console.log('ERRRRRRRRRRRR', e));
console.log('My Test Query:', testQuery);
