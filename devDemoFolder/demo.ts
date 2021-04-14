// import { Dorm } from '../mod.ts';
// import { config } from '../deps.ts';

// const env = config();

// const url = `postgres://${env.USERNAME}:${env.PASSWORD}@ziggy.db.elephantsql.com:5432/${env.USERNAME}`;

// const dorm = new Dorm(url);

/* -------------------------------------------------------------------------- */
/*                                SIMPLE QUERY                                */
/* -------------------------------------------------------------------------- */

// const simpleSelect = dorm.select().from('people').toString();
// console.log(simpleSelect);

// const simpleAwait = await dorm.select().from('species');
// console.log(simpleAwait);

// const simpleSelect = await dorm
//   .select()
//   .from('people')
//   .then((data: any) => console.log(data.rows[0]))
//   .catch((e) => e);

// const raw = await dorm.raw('SELECT * FROM people');
// const rawr = await dorm.rawrr(
//   "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'"
// );
// const rawr = await dorm.rawrr(
//   "SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'people'"
// );

// const rawr = await dorm.raw(
//   'SELECT tc.constraint_name, tc.table_name, kcu.column_name, ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name FROM information_schema.table_constraints AS tc JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name ORDER BY tc.table_name'
// );
// async function inner(input: any) {
//   const arr = [];
//   const result = [];
//   for (let i = 0; i < input.length; i++) {
//     arr.push(input[i].table_name);
//   }
//   for (let i = 0; i < arr.length; i++) {
//     const temp = await dorm.rawrr(
//       `SELECT tc.table_schema, tc.table_name, kcu.column_name, ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name FROM information_schema.table_constraints tc JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name WHERE constraint_type = 'FOREIGN KEY' AND ccu.table_name=${arr[i]}`
//     );
//     result.push(temp);
//   }
//   return result;
// }
// console.log(raw);

// dorm.drop('dropthis').then(data => {
//   console.log(data)
// });

/* -------------------------------------------------------------------------- */
/*                                COMPLEX QUERY                               */
/* -------------------------------------------------------------------------- */

/* --------------------------------- BEFORE --------------------------------- */

// //Object from front end
// const reqBodyObj = [
//   { name: 'Han', birth_year: '2050' },
//   { name: 'Hanji', hair_color: 'rainbow' },
//   {
//     hair_color: 'blonde',
//     eye_color: 'green',
//     name: 'Nick',
//     height: 1,
//   },
//   {
//     hair_color: 'dark',
//     mass: 'fair',
//     name: 'Myo',
//     height: 198,
//   }
// ];

// const columns: string[] = [];
// const values: unknown[] = [];

// reqBodyObj.forEach((obj: any) => {
//   Object.keys(obj).forEach((col) => {
//     if (!columns.includes(col)) columns.push(col);
//   });
// });

// reqBodyObj.forEach((obj: any) => {
//   const vals: any = [];
//   columns.forEach((col) => {
//     if (obj[col] === undefined) {
//       vals.push('null');
//     } else if (typeof obj[col] === 'string') {
//       vals.push(`'${obj[col]}'`);
//     } else {
//       vals.push(obj[col]);
//     }
//   });
//   values.push(vals);
// });

// const queryStatement = `INSERT INTO people (${columns}) VALUES (${values}) RETURNING *`;

// db.query(queryStatement).then(data:any => console.log('From db.query():'data));

/* ---------------------------------- AFTER --------------------------------- */

// //Object from front end
// const reqBodyObj = [
//   { name: 'Han', birth_year: '2050' },
//   { name: 'Hanji', hair_color: 'rainbow' },
//   {
//     hair_color: 'blonde',
//     eye_color: 'green',
//     name: 'Nick',
//     height: 1,
//   },
//   {
//     hair_color: 'dark',
//     mass: 'fair',
//     name: 'Myo',
//     height: 198,
//   },
// ];

// const complexQuery: any = await dorm
//   .insert(reqBodyObj)
//   .into('people')
//   .returning();

// console.log(complexQuery.rows);

/* -------------------------------------------------------------------------- */
/*                                INVALID QUERY                               */
/* -------------------------------------------------------------------------- */

/* ----------------------------- MULTIPLE ACTION ---------------------------- */
// await dorm
//   .select()
//   .delete()
//   .returning()
//   .then((data) => console.log(data));

/* ----------------------- MULTIPLE ACTION WITH CATCH ----------------------- */
// await dorm
//   .select()
//   .delete()
//   .returning()
//   .then((data) => console.log(data))
//   .catch((e) => console.log('Error: ', e));

/* --------------------- MULTIPLE ACTION WITH TRY CATCH --------------------- */
// try {
//   await dorm.select().delete().returning();
// } catch (error) {
//   console.log('Error: ', error);
// }
