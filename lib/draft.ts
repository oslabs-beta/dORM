import { query, poolConnect } from './db-connector.ts';
import { template } from './sql-template.ts';

/* ----------------------------- TYPE INTERFACE ----------------------------- */
interface Info {
  action: {
    type: null | string;
    table: null | string;
    columns: null | string | string[];
    values: string;
  };
  join: {
    type: null | string;
    table: null | string;
    on: null | string;
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

/* -------------------------------------------------------------------------- */
/*                                 DORM CLASS                                 */
/* -------------------------------------------------------------------------- */
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
      join: {
        type: null,
        table: null,
        on: null,
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

  /* ------------------------------ INSERT METHOD ----------------------------- */
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

  /* ------------------------------ SELECT METHOD ----------------------------- */
  select(arg?: string) {
    this.info.action.type = 'SELECT';
    if (arg) this.info.action.columns = arg;
    return this;
  }

  /* ------------------------------ UPDATE METHOD ----------------------------- */
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

  /* ------------------------------ DELETE METHOD ----------------------------- */
  delete() {
    this.info.action.type = 'DELETE';
    return this;
  }

  /* ------------------------------- DROP METHOD ------------------------------ */
  drop(arg?: string) {
    this.info.action.type = 'DROP';
    if (arg) this.info.action.table = arg;
    return this;
  }

  /* ------------------------------ TABLE METHOD ------------------------------ */
  table(arg: string) {
    this.info.action.table = arg;
    return this;
  }
  /**
   * Alias for table method
   */
  from = this.table;
  into = this.table;

  /* ------------------------------ JOIN METHODS ------------------------------ */
  join(arg: string) {
    this.info.join.type = 'INNER';
    this.info.join.table = arg;
    return this;
  }

  leftJoin(arg: string) {
    this.info.join.type = 'LEFT';
    this.info.join.table = arg;
    return this;
  }

  rightJoin(arg: string) {
    this.info.join.type = 'RIGHT';
    this.info.join.table = arg;
    return this;
  }

  fullJoin(arg: string) {
    this.info.join.type = 'FULL';
    this.info.join.table = arg;
    return this;
  }
  /**
   * Alias for join method
   */
  innerJoin = this.join;
  leftOuterJoin = this.leftJoin;
  rightOuterJoin = this.rightJoin;
  fullOuterJoin = this.fullJoin;

  /* -------------------------------- ON METHOD ------------------------------- */
  on(arg: string) {
    this.info.join.on = arg;
    return this;
  }

  /* ------------------------------ WHERE METHOD ------------------------------ */
  where(arg: string) {
    this.info.filter.where = true;
    this.info.filter.condition = arg;
    return this;
  }

  /* ---------------------------- RETURNING METHOD ---------------------------- */
  returning(arg?: string) {
    this.info.returning.active = true;
    if (arg) this.info.returning.columns = arg;
    return this;
  }

  /* -------------------------------------------------------------------------- */
  /*                           QUERY BUILDER FUNCTIONS                          */
  /* -------------------------------------------------------------------------- */

  /* ------------------------------ RESET METHOD ------------------------------ */
  private _reset() {
    // clear info for future function
    this.info = {
      action: {
        type: null,
        table: null,
        columns: '*',
        values: '',
      },
      join: {
        type: null,
        table: null,
        on: null,
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
  }

  /* ------------------------------- THEN METHOD ------------------------------ */
  async then(callback: Callback) {
    const action = this.info.action.type;
    const join = this.info.join.type;
    const filter = this.info.filter.where;
    const returning = this.info.returning.active;

    let queryTemplate = '';
    if (action) queryTemplate = this.template(action);
    if (join) {
      queryTemplate += this.template('JOIN');
      queryTemplate += this.template('ON');
    }
    if (filter) queryTemplate += this.template('WHERE');
    if (returning) queryTemplate += this.template('RETURNING');

    console.log('Dorm then QUERY STRING: ', queryTemplate);

    const result = await query(queryTemplate);

    this._reset();

    const promise = new Promise((resolve, reject) => {
      try {
        resolve(callback(result));
      } catch (e) {
        reject(e);
      }
    });

    return promise;
  }

  /* ----------------------------- TOSTRING METHOD ---------------------------- */
  toString() {
    const action = this.info.action.type;
    const join = this.info.join.type;
    const filter = this.info.filter.where;
    const returning = this.info.returning.active;

    let queryTemplate = '';
    if (action) queryTemplate = this.template(action);
    if (join) {
      queryTemplate += this.template('JOIN');
      queryTemplate += this.template('ON');
    }
    if (filter) queryTemplate += this.template('WHERE');
    if (returning) queryTemplate += this.template('RETURNING');

    console.log('Dorm toString QUERY STRING: ', queryTemplate);

    this._reset();

    return queryTemplate;
  }
}
