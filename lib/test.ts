import { pool, PoolClient } from './db-connector.ts';

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

export class Dorm {
  info: Info;
  url: string;

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
        condition: null,
      },
      returning: {
        active: false,
        columns: '*',
      },
    };
    this.url = '';
  }

  insert(arg: unknown[]) {
    this.info.action.type = 'INSERT';

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
      });
      values.push(vals);
    });

    this.info.action.columns = columns.join(', ');

    values.forEach((data: any, index: number) => {
      const tail = index === values.length - 1 ? '' : ', ';
      this.info.action.values += `(${data.join(', ')})${tail}`;
    });

    return this;
  }

  select(arg?: string) {
    this.info.action.type = 'SELECT';
    if (arg) this.info.action.columns = arg;
    return this;
  }

  update(obj: any) {
    // IMPLEMENT UPDATE
    this.info.action.type = 'UPDATE';
    this.info.action.columns = '';
    // coulmns and values into info

    Object.keys(obj).forEach((col, index) => {
      let str = `${col} = `;
      // what about undefined value?
      if (typeof obj[col] === 'string') {
        str += `'${obj[col]}'`; // string
      } else {
        str += `${obj[col]}`; // number, null, boolean
      }
      const tail = index === Object.keys(obj).length - 1 ? '' : ', ';
      this.info.action.columns += `${str + tail}`;
    });
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

  async then(callback: Callback) {
    const action = this.info.action.type;
    const filter = this.info.filter.where;
    const returning = this.info.returning.active;

    let queryTemplate = '';
    if (action) queryTemplate = this.template(action);
    if (filter) queryTemplate += ` ${this.template('WHERE')}`;
    if (returning) queryTemplate += ` ${this.template('RETURNING')}`;

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
      const client: PoolClient = await pool.connect();
      const dbResult = await client.queryObject(str);
      client.release();
      return dbResult; // promise object
    } catch (e) {
      throw e;
    }
  }

  connect(url: string) {
    this.url = url;
  }

  template(type: string): string {
    switch (type) {
      case 'INSERT':
        return `INSERT INTO ${this.info.action.table} (${this.info.action.columns}) VALUES ${this.info.action.values}`;
      case 'SELECT':
        return `SELECT ${this.info.action.columns} FROM ${this.info.action.table}`;
      case 'UPDATE':
        return `UPDATE ${this.info.action.table} SET ${this.info.action.columns}`;
      case 'DELETE':
        return `DELETE FROM ${this.info.action.table}`;
      case 'DROP':
        return `DROP TABLE ${this.info.action.table}`;
      case 'WHERE':
        return `WHERE ${this.info.filter.condition}`;
      case 'RETURNING':
        return `RETURNING ${this.info.returning.columns}`;
      default:
        return '';
    }
  }
}
