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

interface Error {
  id: number;
  message: string;
}

/* -------------------------------------------------------------------------- */
/*                                 DORM CLASS                                 */
/* -------------------------------------------------------------------------- */
export class Dorm {
  callOrder: string[]
  error: Error;
  info: Info;
  template: any;
  constructor(url: string) {
    this.callOrder = [];
    
    this.error = {
      id: 0,
      message: '',
    };
    
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
  
  /* ------------------------------ ERROR CHECKING ----------------------------- */
  checkErrors(group: number) {
    
    
    const errorObj = this.error;
    const error =
    (group === 1 && !!this.info.action.type) ||
    (group === 2 && !!this.info.action.table) ||
    (group === 3 && !!this.info.filter.where) ||
    (group === 4 && !!this.info.returning.active) ||
    (group === 5 && !!this.info.join.type) ||
    (group === 6 && !!this.info.join.on);
    
    if (error) errorObj.id = group;
    return error;
  }
  
  setErrorMessage() {
    const msg: any = {
      1: 'No multiple actions',
      2: 'No multiple tables',
      3: 'No multiple wheres',
      4: 'No multiple returning',
      5: 'No multiple joins',
      6: 'No multiple ons',
      7: 'Insert data must be an object or array of objects',
      8: 'Cannot have empty array or object of insert data',
      9: 'No returning on select',
      10: 'No delete without where (use deleteAll to delete all rows)',
      11: 'deleteAll cannot have where'
    };
    this.error.message = msg[this.error.id];
  }
  
  finalErrorCheck() {
    if (this.info.action.type === 'SELECT' && this.info.returning.active) {
      this.error.id = 9;
      return true;
    }
    if (this.info.action.type === 'DELETE' && (!this.info.filter.where || !this.info.filter.condition)) {
      this.error.id = 10;
      return true;
    }
    if (this.info.action.type === 'DELETEALL' && this.info.filter.where) {
      this.error.id = 11;
      return true;
    }
    return false;
  }
  
  
  /* ------------------------------ INSERT METHOD ----------------------------- */
  insert(arg: any | unknown[]) {
    this.callOrder.push('INSERT');
    
    if (typeof arg !== 'object') {
      this.error.id = 7;
      return this;
    }
    
    if (Array.isArray(arg)) {
      if (!arg.length) {
        this.error.id = 8;
        return this;
      }
    }
    
    if (this.checkErrors(1)) return this;
    
    this.info.action.type = 'INSERT';
    
    const columns: string[] = [];
    
    const values: unknown[] = [];
    
    if (!Array.isArray(arg)) {
      if (!Object.keys(arg).length) {
        this.error.id = 8;
        return this;
      }
      const [column, value] = Object.entries(arg)[0];
      
      columns.push(column);
      const val: any = [];
      if (value === undefined) {
        val.push('null');
      } else if (typeof value === 'string') {
        val.push(`'${value}'`);
      } else {
        val.push(value);
      }
      values.push(val);
    } else {
      
      arg.forEach((obj: any) => {
        if (!Object.keys(obj).length) {
          this.error.id = 8;
          return this;
        }
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
    }
    
    this.info.action.columns = columns.join(', ');
    
    values.forEach((data: any, index: number) => {
      const tail = index === values.length - 1 ? '' : ', ';
      this.info.action.values += `(${data.join(', ')})${tail}`;
    });
    
    return this;
  }
  
  /* ------------------------------ SELECT METHOD ----------------------------- */
  select(arg?: string) {
    this.callOrder.push('SELECT');
    
    if (this.checkErrors(1)) return this;
    
    this.info.action.type = 'SELECT';
    if (arg) this.info.action.columns = arg;
    return this;
  }
  
  /* ------------------------------ UPDATE METHOD ----------------------------- */
  update(obj: any) {
    this.callOrder.push('UPDATE');
    
    if (this.checkErrors(1)) return this;
    
    this.info.action.type = 'UPDATE';
    this.info.action.columns = '';
    
    Object.keys(obj).forEach((col, index) => {
      let str = `${col} = `;
      
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
  
  /* ------------------------------ DELETE METHODS ----------------------------- */
  delete(arg?: string) {
    this.callOrder.push('DELETE');
    
    if (this.checkErrors(1)) return this;
    
    this.info.action.type = 'DELETE';
    return this;
  }
  
  deleteAll(arg?: string) {
    this.callOrder.push('DELETEALL');
    
    if (this.checkErrors(1)) return this;
    
    this.info.action.type = 'DELETEALL';
    if (arg) this.info.action.table = arg;
    
    return this;
  }
  
  /* ------------------------------- DROP METHOD ------------------------------ */
  drop(arg?: string) {
    this.callOrder.push('DROP');
    
    if (this.checkErrors(1)) return this;
    
    this.info.action.type = 'DROP';
    if (arg) this.info.action.table = arg;
    return this;
  }
  
  /* ------------------------------ TABLE METHOD ------------------------------ */
  table(arg: string) {
    this.callOrder.push('TABLE');
    
    if (this.checkErrors(2)) return this;
    
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
    this.callOrder.push('JOIN-INNER');
    
    if (this.checkErrors(5)) return this;
    
    this.info.join.type = 'INNER';
    this.info.join.table = arg;
    return this;
  }
  
  leftJoin(arg: string) {
    this.callOrder.push('JOIN-LEFT');
    
    if (this.checkErrors(5)) return this;
    
    this.info.join.type = 'LEFT';
    this.info.join.table = arg;
    return this;
  }
  
  rightJoin(arg: string) {
    this.callOrder.push('JOIN-RIGHT');
    
    if (this.checkErrors(5)) return this;
    
    this.info.join.type = 'RIGHT';
    this.info.join.table = arg;
    return this;
  }
  
  fullJoin(arg: string) {
    this.callOrder.push('JOIN-FULL');
    
    if (this.checkErrors(5)) return this;
    
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
    this.callOrder.push('ON');
    
    if (this.checkErrors(6)) return this;
    
    this.info.join.on = arg;
    return this;
  }
  
  /* ------------------------------ WHERE METHOD ------------------------------ */
  where(arg: string) {
    this.callOrder.push('WHERE');
    
    if (this.checkErrors(3)) return this;
    
    this.info.filter.where = true;
    this.info.filter.condition = arg;
    return this;
  }
  
  /* ---------------------------- RETURNING METHOD ---------------------------- */
  returning(arg?: string) {
    this.callOrder.push('RETURNING');
    
    if (this.checkErrors(4)) return this;
    
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
    this.callOrder = [];
    
    this.error = {
      id: 0,
      message: '',
    };
    
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
  async then(callback: Callback, fail: Callback = (rej) => rej) {
    this.finalErrorCheck();
    
    if (this.error.id) {
      this.setErrorMessage();
      const { message } = this.error
      this._reset();
      
      const cbText = callback.toString();
      
      if (isNative(cbText)) {
        return await callback(Promise.reject(message));
      }
      return await fail(Promise.reject(message));
    }
    // thanks to David Walsh at https://davidwalsh.name/detect-native-function
    function isNative(fn: any) {
      return /\{\s*\[native code\]\s*\}/.test('' + fn);
    }
    const result = await query(this.toString());
    
    try {
      return await callback(result);
    } catch (error) {
      throw error;
    }
  }
  
  /* ----------------------------- TOSTRING METHOD ---------------------------- */
  toString() {
    console.log('order:', this.callOrder);
    
    this.finalErrorCheck();
    
    if (this.error.id) {
      this.setErrorMessage();
      const { message } = this.error
      this._reset();
      throw message;
    }
    
    
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
    
    console.log('dORM QUERY STRING: ', queryTemplate);
    
    this._reset();
    
    return queryTemplate;
  }
  
  /* ------------------------------ RAW METHOD ------------------------------ */
  async raw(arg: string) {
    return await query(arg);
  }
  rawr = this.raw;
  rawrr = this.raw;
}
