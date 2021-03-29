
import { Dorm } from './draft.ts';

const url =
  'postgres://jkwfgvzj:lB9v6K93eU1bjY75YaIzW3TnFMN2PlLF@ziggy.db.elephantsql.com:5432/jkwfgvzj';
const dorm = new Dorm(url);

const testQuery = await dorm
  .select('*, people.name AS name, species.name AS sName')
  .from('people')
  .leftJoin('species')
  .on('people.species_id = species._id')
  .toString();

console.log(testQuery);

// const testQuery = await dorm
//   .update({ name: 'MYOUNGHANJINICK', gender: 'UNICORN' })
//   .table('people')
//   .where('_id = 100')
//   .returning()
//   .then((data: any) => {
//     console.log('Our then');
//     return data.rows;
//   })
//   .then((data) => {
//     console.log('Bult-in then: ', data);
//     return data;
//   })
//   .catch((e) => console.log('ERRRRRRRRRRRR', e));
// console.log('My Test Query:', testQuery);
