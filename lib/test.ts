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
    values: string;
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

interface Callback {
  (key: unknown): unknown;
}

class Dorm {
  info: Info;

  constructor() {
    this.info = {
      action: {
        type: null,
        table: null,
        columns: '*',
        values: '',
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

  // insert(arg: unknown[]) {
  //   this.info.action.type = 'INSERT';
  //   // insert([{column1:value1, column2:value2},{column1:value3, column2:value4}])
  //   const columns: string[] = [];
  //   const values: unknown[] = [];
  //   arg.forEach((obj: any) => {
  //     Object.entries(obj).forEach((arr) => {
  //       columns.push(arr[0]);
  //       values.push(arr[1]);
  //     });
  //   });
  //   console.log('columns', columns);
  //   console.log('values:', values);
  //   return this;
  // }

  // dorm.insert([{name: 'han', species: 'snake'}, {name: 'hanji', species: 'human', age: 50}, {height: 5, age: 10}])
  // column = [column1, column2, column3]
  // column = new Set() // [name, species, age, height]
  // [('han, 'snake', null, null), ('hanji', human, 50, null), (null, null, 50, 5)]
  //INSERT INTO table1 (name,species, age, eyes) VALUES (han, alien, 99)(myo, null, null, yes)

  insert(arg: unknown[]) {
    this.info.action.type = 'INSERT';
    // insert([{column1:value1, column2:value2},{column1:value3, column2:value4}])

    const columns: string[] = [];

    const values: unknown[] = [];

    arg.forEach((obj: any) => {
      Object.keys(obj).forEach((col) => {
        if (!columns.includes(col)) columns.push(col);
      });
    });

    arg.forEach((obj: any) => {
      const vals: any = [];
      columns.forEach((col) => {
        if (obj[col] === undefined) {
          vals.push('null');
        } else if (typeof obj[col] === 'string') {
          vals.push(`'${obj[col]}'`);
        } else {
          vals.push(obj[col]);
        }
        // vals.push(obj[col] || 'null');
      });
      values.push(vals);
    });

    console.log('columns', columns);
    console.log('values:', values);

    this.info.action.columns = columns.join(', ');

    values.forEach((data: any, index: number) => {
      const tail = index === values.length - 1 ? '' : ', ';
      this.info.action.values += `(${data.join(', ')})${tail}`;
    });

    return this;
  }

  /*
  for(const input of arg){
    for(const properties of input){
      this.info.action.columns_2[properties] = {}
    }
  }
  this.info = {
    action: {
      type: null,
      table: null,
      columns_1: {
        index:3
        name: [han], -> [han,hanji,null] 
        species:[alien], -> [alien, null,ull]
        age:[99], -> [99, 120,null]
        height:[null], -> [null, 170, null]
        gender:new Array(3).fill(null), ->[null,null,male]
      }
      columns_2: {
        name: {'0': 'han', '1': 'hanji'}
        species:{'1':'human'}
        age:{'1': 50, '2': '10'}
        height:{'2': '5'}
      }
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

  async then(callback: Callback) {
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
        values: '',
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

function template(type: string): string {
  switch (type) {
    case 'SELECT':
      return `SELECT ${dorm.info.action.columns} FROM ${dorm.info.action.table}`;
    case 'DELETE':
      return `DELETE FROM ${dorm.info.action.table}`;
    case 'DROP':
      return `DROP TABLE ${dorm.info.action.table}`;
    case 'INSERT':
      // do logic in here for values result = [(),(),()]
      return `INSERT INTO ${dorm.info.action.table} (${dorm.info.action.columns}) VALUES ${dorm.info.action.values}`;
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
  .insert([
    { name: 'hantest2', gender: 'male' },
    { name: 'hanjitest2', hair_color: 'sexy' },
    {
      hair_color: 'tits',
      eye_color: 'rainbow',
      name: 'nicktest2',
      height: 99,
    },
  ])
  .from('people')
  .returning()
  .then((data: any) => {
    console.log('Our then');
    return data.rows;
  })
  .then((data) => {
    console.log('Bult-in then: ', data);
    return data;
  })
  .catch((e) => console.log('ERRRRRRRRRRRR', e));
console.log('My Test Query:', testQuery);
