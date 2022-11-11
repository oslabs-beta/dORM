import { Dorm } from './query-builder';

enum Methods{
  Insert,
  Select,
  Update,
  UpdateAll,
  Delete,
  DeleteAll,
  Drop,
  Join,
  On,
  Where,
  Returning
}


type TemplateList = Record<Methods, string>

export function getTemplate(this: Dorm, arg: string): string {
  const templateList: TemplateList = {
      [Methods.Insert]: `INSERT INTO ${this.info.action.table} (${this.info.action.columns}) VALUES ${this.info.action.valuesParam}`,
      [Methods.Select]: `SELECT ${this.info.action.columns} FROM ${this.info.action.table}`,
      [Methods.Update]: `UPDATE ${this.info.action.table} SET ${this.info.action.columns}`,
      [Methods.UpdateAll]: `UPDATE ${this.info.action.table} SET ${this.info.action.columns}`,
      [Methods.Delete]: `DELETE FROM ${this.info.action.table}`,
      [Methods.DeleteAll]: `DELETE FROM ${this.info.action.table}`,
      [Methods.Drop]: `DROP TABLE ${this.info.action.table}`,
      [Methods.Join]: ` ${this.info.join[0]?.type} ${this.info.join[0]?.table}`,
      [Methods.On]: ` ON ${this.info.join[0]?.on}`,
      [Methods.Where]: ` WHERE ${this.info.filter.condition}`,
      [Methods.Returning]: ` RETURNING ${this.info.returning.columns}`,
    }
  return (
    templateList[arg] ?? ''
    );
  }
  