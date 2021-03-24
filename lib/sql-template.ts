import { dorm } from './test.ts';

interface Template {
  [propName: string]: string;
}

export const template: Template = {
  SELECT: `SELECT ${dorm.info.action.columns} FROM ${dorm.info.action.table}`,
  WHERE: `WHERE ${dorm.info.filter.column} ${dorm.info.filter.operator} ${dorm.info.filter.value}`,
};
