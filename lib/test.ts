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

  async then(callback: (data: unknown) => unknown) {
    const action = this.info.action.type;
    const filter = this.info.filter.where;
    //if(!action){throw new Error}

    let queryTemplate = template(action)!;
    if (filter) queryTemplate = queryTemplate.concat(` ${template('WHERE')}`);

    const result = await this.query(queryTemplate);

    const promise = new Promise((resolve, reject) => {
      resolve(callback(result));
    });

    return promise;
  }

  async query(str: string) {
    // queries DB
    const client: PoolClient = await pool.connect();
    const dbResult = await client.queryObject(str);
    client.release();
    return dbResult;
  }
}

const dorm = new Dorm();

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
    default:
    // return;
  }
}
/**
 * USER------------------------------------------------------------------------
 */

const testQuery = await dorm
  .select('*')
  .from('people')
  .where('_id = 1')
  // .and('name = HanDump')  // SELECT * FROM "public"."people" WHERE (hair_color = 'none' OR hair_color = 'blond') AND height > 180 AND NOT eye_color = 'red'
  // .or('_id != 3')
  .then((data) => {
    console.log('first then');
    return 'FIRST PROMISE RESULT';
  })
  .then((data) => {
    console.log('promise then: ', data);
  });
// .then((output) => output.rows[0]);
// console.log('My Test Query:', testQuery);

// example template:

// // SELECT
// BASE SELECT QUERY: `SELECT ${columns} FROM ${primaryTable}`

// // JOINS CLAUSE: `${joinType} ${secondaryTable}`

// // ON CLAUSE: `ON ${primaryColumnName} ${operator} ${secondaryColumnName}`

// operator.toUpperCase()
// WHERE CLAUSE:`WHERE ${columnName} ${operator} ${value}`

// // GROUP BY CLAUSE:

// // ORDER BY CLAUSE:

// // DELETE
// BASE DELETE QUERY: `DELETE FROM ${table}`

// WHERE CLAUSE: `WHERE ${columnName} ${operator} ${value}`

// RETURNING CLASE: `RETURNING ${columns}`

// DROP QUERY: `DROP TABLE ${table}`

// // INSERT
// INSERT QUERY: `INSERT INTO ${table} (${columns}) VALUES (${values})`

// RETURNING CLAUSE: `RETURNING ${columns}`

// dorm.insert(123 or [values] or {column:value}).into(table)

// // UPDATE
// UPDATE QUERY: `UPDATE ${table} SET ${columns} = ${values}` // UPDATE table1 SET column1 = value1, column2 = value2, column3 = value3
// //set {(column1, column2, column3) = (value1, value2, value3)}

// WHERE CLAUSE: `WHERE ${columnName} ${operator} ${value}`

// RETURNING CLAUSE: `RETURNING ${columns}`

// dorm.update()

// switch
// case:
// case:

// dorm.select(column).from(table).then((res) => console.log(res))

// function then(func) {
//   // we need to figure out what is the final query is by looking at the action type

//   // So what is the action type?
//   let action = this.info.ACTION.type
//   let filter = this.info.FILTER.type
//   let actionTemplate = template[action] // => SELECT
// }

// info:info {
//   ACTION: {type: SELECT, INSERT, DELETE, DROP, UPDATE, table: tablename, columns: columns, values: values},
//   FILTER: {type: WHERE, columns: columns, operator: operator, values: values}
// }
