import { query, poolConnect } from './db-connector.ts';
import { template } from './sql-template.ts';

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

/**
 * CLASS DORM STARTS FROM HERE ----------------------------------------
 *
 * @export
 * @class Dorm
 */
export class Dorm {
  info: Info;
  template: any;
  constructor(url: string) {
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
    poolConnect(url);
    this.template = template.bind(this);
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
    console.log('columns:', this.info.action.columns);
    console.log('values:', this.info.action.values);
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

    // console.log('QUERY STRING: ', queryTemplate);

    const result = await query(queryTemplate);

    // clear info for future function
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
}
