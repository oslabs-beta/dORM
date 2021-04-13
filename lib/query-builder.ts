import { query, poolConnect } from './db-connector.ts';
import { template } from './sql-template.ts';
import { validate } from './validate-strings.ts';

/* ----------------------------- TYPE INTERFACE ----------------------------- */
interface Info {
  action: {
    type: null | string;
    table: null | string;
    columns: null | string | string[];
    values: unknown[];
    valuesParam: string;
  };
  join: Joins[];
  filter: {
    where: boolean;
    condition?: any;
  };
  returning: {
    active: boolean;
    columns: string | string[];
  };
}

interface Joins {
  type?: string;
  table?: string;
  on?: any;
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
        values: [],
        valuesParam: '',
      },
      join: [],
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
      5: 'Number of ONs must equal number of JOINs',
      7: 'Insert data must be an object or array of objects',
      8: 'Cannot have empty array/object of insert/update data',
      9: 'No returning on select',
      10: 'No delete without where (use deleteAll to delete all rows)',
      11: 'deleteAll cannot have where',
      12: 'Invalid on clause',
      13: 'Invalid where clause',
      98: 'Invalid tables (cannot contain quotes)',
      99: 'Invalid columns (cannot contain quotes)',
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
    
    for (const el of this.info.join) {
      if (!validate.columnsTables(el.table)) {
        this.error.id = 98;
        return true;
      }
    }
    
    if(!validate.columnsTables(this.info.action.table)) {
      this.error.id = 98;
      return true;
    }
    
    if (!validate.columnsTables(this.info.action.columns) || !validate.columnsTables(this.info.returning.columns)) {
      this.error.id = 99;
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
        val.push(null);
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
      
      if (!validate.columnsTables(columns)) {
        this.error.id = 99;
        return this;
      }
      
      arg.forEach((obj: any) => {
        const vals: any = [];
        columns.forEach((col) => {
          if (obj[col] === undefined) {
            vals.push(null);
          } else {
            vals.push(obj[col]);
          }
        });
        values.push(vals);
      });
    }
    
    this.info.action.columns = columns.join(', ');
    
    // create parameter strings
    this.info.action.values = values.flat();
    let paramCount = 0;
    const valuesBound = values.map((el: any) => el.map((ele: any) => {
      paramCount++;
      return `$${paramCount}`
    }
    )); 
    
    valuesBound.forEach((data: any, index: number) => {
      const tail = index === valuesBound.length - 1 ? '' : ', ';
      this.info.action.valuesParam += `(${data.join(', ')})${tail}`;
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
    
    if (!Object.keys(obj).length || Array.isArray(obj)) {
      this.error.id = 8;
      return this;
    }
    
    if (!validate.columnsTables(Object.keys(obj))) {
      this.error.id = 99;
      return this;
    }
    
    this.info.action.type = 'UPDATE';
    this.info.action.columns = '';
    
    Object.keys(obj).forEach((col, index) => {
      const str = `${col} = $${index + 1}`;
      
      this.info.action.values.push(obj[col]);
      
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
    if (arg) this.info.action.table = arg;
    
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
    const joinList = this.info.join;
    for (const el of joinList) {
      if(!el.type) {
        el.type = 'INNER JOIN';
        el.table = arg;
        return this;
      }
    }
    joinList.push({type:'INNER JOIN', table: arg})  
    return this;
  }
  
  leftJoin(arg: string) {
    this.callOrder.push('JOIN-LEFT');
    
    const joinList = this.info.join;
    for (const el of joinList) {
      if(!el.type) {
        el.type = 'LEFT JOIN';
        el.table = arg;
        return this;
      }
    }
    
    joinList.push({type:'LEFT JOIN', table: arg})  
    return this;
  }
  
  rightJoin(arg: string) {
    this.callOrder.push('JOIN-RIGHT');
    
    const joinList = this.info.join;
    for (const el of joinList) {
      if(!el.type) {
        el.type = 'RIGHT JOIN';
        el.table = arg;
        return this;
      }
    }
    joinList.push({type:'RIGHT JOIN', table: arg})
    
    return this;
  }
  
  fullJoin(arg: string) {
    this.callOrder.push('JOIN-FULL');
    
    const joinList = this.info.join;
    
    for (const el of joinList) {
      if(!el.type) {
        el.type = 'FULL JOIN';
        el.table = arg;
        return this;
      }
    }
    joinList.push({type:'FULL JOIN', table: arg})
    
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
    
    const validated = validate.onWhere(arg);
    
    if (validated === 'Error') {
      this.error.id = 12;
      return this;
    }
    
    const joinList = this.info.join;
    for (const el of joinList) {
      if(!el.on) {
        el.on = validated;
        return this;
      }
    } 
    joinList.push({on: validated})
    
    return this;
  }
  
  /* ------------------------------ WHERE METHOD ------------------------------ */
  where(arg: string) {
    this.callOrder.push('WHERE');
    
    if (this.checkErrors(3)) return this;
    
    const validated = validate.onWhere(arg);
    
    if (validated === 'Error') {
      this.error.id = 13;
      return this;
    }
    
    this.info.filter.where = true;
    this.info.filter.condition = validated;
    
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
        values: [],
        valuesParam: '',
      },
      join: [],
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
    if(this.info.join){
      this.info.join.forEach(el => {
        if(!el.on && el.type)
        this.error.id = 6;
      })
    }
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
    
    let result: any;
    try{
      const params = this.info.action.values
      result = await query(this.toString(), params);
    } catch(e) {
      this._reset();
      
      const cbText = callback.toString();
      
      if (isNative(cbText)) {
        return await callback(Promise.reject(e));
      }
      return await fail(Promise.reject(e));
    }
    
    try {
      return await callback(result);
    } catch (error) {
      throw error;
    }
    
    // thanks to David Walsh at https://davidwalsh.name/detect-native-function
    function isNative(fn: any) {
      return /\{\s*\[native code\]\s*\}/.test('' + fn);
    }
  }
  
  /* ----------------------------- TOSTRING METHOD ---------------------------- */
  toString(){
    
    this.finalErrorCheck();
    
    if (this.error.id) {
      this.setErrorMessage();
      const { message } = this.error
      this._reset();
      throw message;
    }
    
    const action = this.info.action.type;
    const joinList = this.info.join;
    const filter = this.info.filter.where;
    const returning = this.info.returning.active;
    
    let queryTemplate = '';
    
    if (action) queryTemplate = this.template(action);
    
    while(joinList.length) {
      const el = joinList[0];
      if (el.type?.includes('JOIN') && el.on) {
        queryTemplate += this.template('JOIN');
        
        const params = validate.insertParams(el.on.tokens, this.info.action.values.length + 1);
        this.info.action.values.push(...el.on.values);
        
        el.on = params.join(' ');
        queryTemplate += this.template('ON');
        
      } else {        
        this.error.id = 5
        this.setErrorMessage();
        const { message } = this.error
        this._reset();
        throw message;
      }
      joinList.shift();
    }
    
    if (this.info.filter.where) {
      const whereCondition = this.info.filter.condition;
      const params = validate.insertParams(whereCondition.tokens, this.info.action.values.length + 1);
      this.info.action.values.push(...whereCondition.values);
      
      this.info.filter.condition = params.join(' ');
      
      queryTemplate += this.template('WHERE');
    }
    
    if (returning) queryTemplate += this.template('RETURNING');
    
    this._reset();
    
    return queryTemplate;
  }
  
  
  toObj() {
    const values = this.info.action.values;
    const text = this.toString();
    return {
      text,
      values,
    };
  }
  /**
  * Alias for toObj method
  */
  toObject = this.toObj;
  
  
  /* ------------------------------ RAW METHOD ------------------------------ */
  async raw(arg: string, vals: unknown[] = []) {
    return await query(arg, vals);
  }
  rawr = this.raw;
  rawrr = this.raw;
}