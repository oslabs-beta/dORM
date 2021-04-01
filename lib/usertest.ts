import { Dorm } from './draft.ts';

const url =
'postgres://jkwfgvzj:lB9v6K93eU1bjY75YaIzW3TnFMN2PlLF@ziggy.db.elephantsql.com:5432/jkwfgvzj';
const dorm = new Dorm(url);

// **** SELECT

// async function test() {
// try {
//   const testQuery: any = await dorm.rawrr(
//     'SELECT ** FROM people WHERE _id = 1'
//   );
//   // .select()//'*')
//   // .select()
//   // .from('films')
//   // .where('_id = 1')
//   // .then((data: any) => {
//   //   console.log('first then');
//   //   return data.rows[0];
//   // })
//   //   .then((data: any) => {
//   // // throw Error('test err');
//   //     console.log('promise then: ', data);
//   //     return data;
//   //   })
//   // .catch(e => console.log('.catch error:', e));

//   console.log('testQuery:', testQuery);
// } catch (e) {
//   console.log('Errorrrrr:', e);
// }
// }



// test().catch(e => console.log(e));

// console.log('testQuery:', testQuery.rows[0]);

// **** UPDATE

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

// **** INSERT

// const testQuery = await dorm
// // .insert([
// //   { name: 'hantest2', gender: 'male' },
// //   { name: 'hanjitest2', hair_color: 'sexy' },
// //   {
// //     hair_color: 'tits',
// //     eye_color: 'rainbow',
// //     name: 'nicktest2',
// //     height: 99,
// //   },
// // ])
// .insert([{name: 'Elvis'}, {name: 'Lebowski', hair_color: undefined}])
// .from('people')
// .returning('name')
// .then((data: any) => {
//   console.log('Our then');
//   return data.rows;//[0];
// })
// .then((data) => {
//   console.log('Bult-in then: ', data);
//   return data;
// })
// .catch(e => console.log('.catch error:', e));

// console.log('testQuery:', testQuery)

// **** SELECT #2

// const testQuery = await dorm
//    .select()
//    .table('people')
//    .then((data: any) => {
//      console.log('Our then');
//      return data.rows[0];
//    })
//    .then((data) => {
//      console.log('Bult-in then: ', data);
//      return data;
//    })
//    .catch((e) => console.log('ERRRRRRRRRRRR', e));
//  console.log('My Test Query:', testQuery);


// const testQuery: any = await dorm
// .select() //'*')
// .select()
// .from('people')
// .where('_id = 1')
// .then((data: any) => {
//   console.log('first then');
//   return data.rows[0];
// })
//   .then((data: any) => {
// // throw Error('test err');
//     console.log('promise then: ', data);
//     return data;
//   })
// .catch(e => console.log('.catch error:', e));


// console.log('testQuery:', testQuery.rows[0]);
