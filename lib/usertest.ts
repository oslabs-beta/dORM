import { Dorm } from './test.ts';

const url =
  'postgres://jkwfgvzj:lB9v6K93eU1bjY75YaIzW3TnFMN2PlLF@ziggy.db.elephantsql.com:5432/jkwfgvzj';
const dorm = new Dorm(url);

const testQuery = await dorm
  .select('*')
  .from('films')
  .where('_id = 1')
  .then((data: any) => {
    console.log('first then');
    return data.rows[0];
  })
  .then((data: any) => {
    console.log('promise then: ', data);
    return data;
  });

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
