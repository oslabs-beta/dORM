// interface Template {
//   [propName: string]: string;
// }

// export const template: Template = {
//   SELECT: `SELECT ${dorm.info.action.columns} FROM ${dorm.info.action.table}`,
//   WHERE: `WHERE ${dorm.info.filter.column} ${dorm.info.filter.operator} ${dorm.info.filter.value}`,
// };

// example template:

// // SELECT
// BASE SELECT QUERY: `SELECT ${columns} FROM ${primaryTable}`

// // JOINS CLAUSE: `${joinType} ${secondaryTable}`

// // ON CLAUSE: `ON ${primaryColumnName} ${operator} ${secondaryColumnName}`

// operator.toUpperCase()
// WHERE CLAUSE:`WHERE ${columnName} ${operator} ${value}`

// // GROUP BY CLAUSE:

// // ORDER BY CLAUSE:

// // DELETE
// BASE DELETE QUERY: `DELETE FROM ${table}`

// WHERE CLAUSE: `WHERE ${columnName} ${operator} ${value}`

// RETURNING CLASE: `RETURNING ${columns}`

// DROP QUERY: `DROP TABLE ${table}`

// // INSERT
// INSERT QUERY: `INSERT INTO ${table} (${columns}) VALUES (${values})`

// RETURNING CLAUSE: `RETURNING ${columns}`

// dorm.insert(123 or [values] or {column:value}).into(table)

// // UPDATE
// UPDATE QUERY: `UPDATE ${table} SET ${columns} = ${values}` // UPDATE table1 SET column1 = value1, column2 = value2, column3 = value3
// //set {(column1, column2, column3) = (value1, value2, value3)}

// WHERE CLAUSE: `WHERE ${columnName} ${operator} ${value}`

// RETURNING CLAUSE: `RETURNING ${columns}`

// dorm.select(column).from(table).then((res) => console.log(res))

// info:info {
//   ACTION: {type: SELECT, INSERT, DELETE, DROP, UPDATE, table: tablename, columns: columns, values: values},
//   FILTER: {type: WHERE, columns: columns, operator: operator, values: values}
// }

// SELECT * FROM "public"."people" WHERE (hair_color = 'none' OR hair_color = 'blond') AND height > 180 AND NOT eye_color = 'red'
