import { Dorm } from './draft.ts';

export function template(this: Dorm, arg: string): string {
  return (
    {
      'INSERT': `INSERT INTO ${this.info.action.table} (${this.info.action.columns}) VALUES ${this.info.action.valuesParam}`,
      'SELECT': `SELECT ${this.info.action.columns} FROM ${this.info.action.table}`,
      'UPDATE': `UPDATE ${this.info.action.table} SET ${this.info.action.columns}`,
      'DELETE': `DELETE FROM ${this.info.action.table}`,
      'DELETEALL': `DELETE FROM ${this.info.action.table}`,
      'DROP': `DROP TABLE ${this.info.action.table}`,
      'JOIN': ` ${this.info.join.type} JOIN ${this.info.join.table}`,
      'ON': ` ON ${this.info.join.on}`,
      'WHERE': ` WHERE ${this.info.filter.condition}`,
      'RETURNING': ` RETURNING ${this.info.returning.columns}`,
    }[arg] ?? ''
    );
  }
