/* ------------------------------- INTERFACES ------------------------------- */
interface arr {
  [key: string]: null | string | number;
}

/**
 * This is a helper function that generates models for the tables in the
 * database into user's directory.
 *
 * The model files will be created inside the 'model' directory
 *
 * @param {unknown[]} arr Takes in a resulted query from 'relationships.sql'
 */

function modelGenerator(arr: arr[]) {
  const result = {}
  let currTable = arr[0].table_name;
  let table = {};

  for(let i = 0; i < arr.length; i++){
    
  }


  return result;
}


table_name: "vessels_in_films",
table_schema: "public",
column_name: "film_id",
ordinal_position: 3,
column_default: null,
is_nullable: "NO",
data_type: "bigint",
udt_name: "int8",
is_updatable: "YES",
constraint_name: "vessels_in_films_fk1",
constraint_type: "FOREIGN KEY",
foreign_table_name: "films",
foreign_column_name: "_id"
