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
  message: string
}

/* -------------------------------------------------------------------------- */
/*                                 DORM CLASS                                 */
/* -------------------------------------------------------------------------- */
export class Dorm {
  error: Error;
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
    this.error = { 
      id: 0,
      message: '',
    };
    poolConnect(url);
    this.template = template.bind(this);
  }
  
  /* ------------------------------ ERROR CHECKING ----------------------------- */
  checkErrors(group: number) {
    const errorObj = this.error;
    const error = (group === 1 && !!this.info.action.type) ||
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
    }
    this.error.message = msg[this.error.id]
  }
  
  /* ------------------------------ INSERT METHOD ----------------------------- */
  insert(arg: unknown[]) {
    if (this.checkErrors(1)) return this;
    
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
    if (this.checkErrors(1)) return this;
    
    this.info.action.type = 'SELECT';
    if (arg) this.info.action.columns = arg;
    return this;
  }
  
  /* ------------------------------ UPDATE METHOD ----------------------------- */
  update(obj: any) {
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
  
  /* ------------------------------ DELETE METHOD ----------------------------- */
  delete() {
    if (this.checkErrors(1)) return this;
    
    this.info.action.type = 'DELETE';
    return this;
  }
  
  /* ------------------------------- DROP METHOD ------------------------------ */
  drop(arg?: string) {
    if (this.checkErrors(1)) return this;
    
    this.info.action.type = 'DROP';
    if (arg) this.info.action.table = arg;
    return this;
  }
  
  /* ------------------------------ TABLE METHOD ------------------------------ */
  table(arg: string) {
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
    if (this.checkErrors(5)) return this;
    
    this.info.join.type = 'INNER';
    this.info.join.table = arg;
    return this;
  }
  
  leftJoin(arg: string) {
    if (this.checkErrors(5)) return this;
    
    this.info.join.type = 'LEFT';
    this.info.join.table = arg;
    return this;
  }
  
  rightJoin(arg: string) {
    if (this.checkErrors(5)) return this;
    
    this.info.join.type = 'RIGHT';
    this.info.join.table = arg;
    return this;
  }
  
  fullJoin(arg: string) {
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
    if (this.checkErrors(6)) return this;
    
    this.info.join.on = arg;
    return this;
  }
  
  /* ------------------------------ WHERE METHOD ------------------------------ */
  where(arg: string) {
    if (this.checkErrors(3)) return this;
    
    this.info.filter.where = true;
    this.info.filter.condition = arg;
    return this;
  }
  
  /* ---------------------------- RETURNING METHOD ---------------------------- */
  returning(arg?: string) {
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

    if (this.error.id) {
      
      this.setErrorMessage();

      const cbText = callback.toString();
      if (isNative(cbText)) {
        return await callback(Promise.reject(this.error.message));
      }
      return await fail(Promise.reject(this.error.message));
    }
    // thanks to David Walsh at https://davidwalsh.name/detect-native-function
    function isNative(fn: any) {
      return (/\{\s*\[native code\]\s*\}/).test('' + fn);
    }
    
    const result = await query(this.toString());
    
    try{
      return await callback(result);
    } catch (e) {
      throw e;
    }
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
