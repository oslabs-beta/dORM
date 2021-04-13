/* ------------------------------- INTERFACES ------------------------------- */
interface Obj {
  table_name: string;
  table_schema: string;
  column_name: string;
  ordinal_position: number;
  column_default: null | string;
  is_nullable: string;
  data_type: string;
  udt_name: string;
  is_updatable: string;
  constraint_name: string | null;
  constraint_type: string | null;
  foreign_table_name: string | null;
  foreign_column_name: string | null;
}

/**
 * This is a helper function that generates models for the tables in the
 * database into user's directory.
 *
 * The model files will be created inside the 'model' directory
 *
 * @param {unknown[]} arr Takes in a resulted query from 'relationships.sql'
 */

function _columnHelper(obj: Obj) {
  const result: any = {};

  if (obj.column_default) result['autoIncrement'] = true;

  result['dataType'] = obj.udt_name;

  obj.is_nullable === 'YES'
    ? (result['nullable'] = true)
    : (result['nullable'] = false);

  if (obj.constraint_type === 'PRIMARY KEY') {
    result['primaryKey'] = true;
  } else if (obj.constraint_type === 'FOREIGN KEY') {
    result['reference'] = {
      table: obj.foreign_table_name,
      column: obj.foreign_column_name,
    };
  }

  return result;
}

function _generatorHelper(arr: any) {
  const result: any = {};

  // Loop through the columns and make an object for the model
  for (let i = 0; i < arr.length; i++) {
    if (!result[arr[i].table_name]) result[arr[i].table_name] = {};
    result[arr[i].table_name][arr[i].column_name] = _columnHelper(arr[i]);
  }

  return result;
}

export default _generatorHelper;
