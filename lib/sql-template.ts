import { Dorm } from './test.ts';

export function template(this: Dorm, type: string): string {
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
