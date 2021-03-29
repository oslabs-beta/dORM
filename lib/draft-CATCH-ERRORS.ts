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
// added Error interface
interface Error {
  id: number;
  message: string
}

/**
* CLASS DORM STARTS FROM HERE ----------------------------------------
*
* @export
* @class Dorm
*/
export class Dorm {
  info: Info;
  // added error
  error: Error;
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
    // added this.error
    this.error = { 
      id: 0,
      message: '',
    };
    poolConnect(url);
    this.template = template.bind(this);
  }
  
  // added checkErrors function
  checkErrors(group: number) {
    const errorObj = this.error;
    const error = (group === 1 && !!this.info.action.type) ||
    (group === 2 && !!this.info.action.table) ||
    (group === 3 && !!this.info.filter.where) ||
    (group === 4 && !!this.info.returning.active);
    
    if (error) errorObj.id = group;
    return error;
  }
  
  setErrorMessage() {
    const msg: any = {
      1: 'No multiple actions',
      2: 'No multiple tables',
      3: 'No multiple wheres',
      4: 'No multiple returning',
    }
    this.error.message = msg[this.error.id]
  }
  
  insert(arg: unknown[]) {
    // added checkErrors call
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
  
  select(arg?: string) {
    if (this.checkErrors(1)) return this;
    
    this.info.action.type = 'SELECT';
    if (arg) this.info.action.columns = arg;
    return this;
  }
  
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
  
  delete() {
    if (this.checkErrors(1)) return this;
    
    this.info.action.type = 'DELETE';
    return this;
  }
  
  drop(arg?: string) {
    if (this.checkErrors(1)) return this;
    
    this.info.action.type = 'DROP';
    if (arg) this.info.action.table = arg;
    return this;
  }
  
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
  
  where(arg: string) {
    if (this.checkErrors(3)) return this;
    
    this.info.filter.where = true;
    this.info.filter.condition = arg;
    return this;
  }
  
  returning(arg?: string) {
    if (this.checkErrors(4)) return this;
    
    this.info.returning.active = true;
    if (arg) this.info.returning.columns = arg;
    return this;
  }
  
  async then(callback: Callback) {
    if (this.error.id) {
      this.setErrorMessage();
      return new Promise((resolve, reject) => {
        reject(this.error.message);
      });
    }
    
    const action = this.info.action.type;
    const filter = this.info.filter.where;
    const returning = this.info.returning.active;
    
    let queryTemplate = '';
    if (action) queryTemplate = this.template(action);
    if (filter) queryTemplate += ` ${this.template('WHERE')}`;
    if (returning) queryTemplate += ` ${this.template('RETURNING')}`;
    
    console.log('QUERY STRING: ', queryTemplate);
    
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
