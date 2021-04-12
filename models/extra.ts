// import { parse } from 'https://deno.land/std/flags/mod.ts';
// import { resolve } from 'https://deno.land/std/path/mod.ts';
// import {
//   emptyDir,
//   ensureDir,
//   ensureFile,
//   ensureDirSync,
//   ensureFileSync,
// } from 'https://deno.land/std/fs/mod.ts';

// async function main(args: string[]) {
//   const {
//     type,
//     name,
//     not,
//     help,
//     _: [dir = '.'],
//   } = parse(args);

//   const dirFullPath = resolve(Deno.cwd(), String(dir));
//   let includeFiles = true;
//   let includeDirs = true;
//   let types = type ? (Array.isArray(type) ? type : [type]) : ['f', 'd'];

//   if (!types.includes('f')) {
//     includeFiles = false;
//   }

//   if (!types.includes('d')) {
//     includeDirs = false;
//   }

//   const options = {
//     maxDepth: 2,
//     includeFiles,
//     includeDirs,
//     followSymlinks: false,
//     skip: [/node_modules/g],
//   };

//   for await (const entry of walk(dirFullPath, options)) {
//     console.log(entry.path);
//   }
// }

// main(Deno.args);

// ensureDirSync('./dorm');
// const write = Deno.writeTextFile('./dorm/schema.dorm', text);

// ensureDirSync('./models'); //.then(() => console.log('han dump'));

// write = Deno.writeTextFile('./models/model.ts', text);

// deno run -A --unstable https://denoland/x/dorm/init.ts --> make env and dorm file

// **USER IS GOING TO INPUT DATABASE URL JUST LIKE PRISMA

// deno run -A --unstable hhtps://denoland/x/dorm/generate.ts

// -----------------------------------------------------------------------------------------------------------------

/* -------------------------------------------------------------------------- */
/*                       QUERY FOR GETTING RELATIONSHIP                       */
/* -------------------------------------------------------------------------- */

// "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'"

// "SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'people'"

// `SELECT tc.constraint_name, tc.table_name, kcu.column_name, ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name FROM information_schema.table_constraints AS tc JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name WHERE constraint_type = 'FOREIGN KEY' AND tc.table_name='mytable'`

//
// Grab existing relationships from the database

// select * from people AS p LEFT JOIN (SELECT * FROM species) AS s ON p.species_id = s._id WHERE p._id =1
// select *, p.name, s.name AS species from people AS p LEFT JOIN (SELECT * FROM species) AS s ON p.species_id = s._id WHERE p._id =1

// SELECT iss.table_schema, iss.table_name, iss.column_name, iss.is_nullable, iss.data_type, iss.udt_name, iss.is_updatable, kt.constraint_name, kt.foreign_table_name, kt.foreign_column_name
// FROM INFORMATION_SCHEMA.COLUMNS AS iss
// LEFT JOIN (SELECT tc.constraint_name, tc.table_name, kcu.column_name, ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name
// FROM information_schema.table_constraints AS tc
// JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
// JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
// WHERE constraint_type = 'FOREIGN KEY' AND tc.table_name='people') AS kt
// ON iss.column_name = kt.column_name
// WHERE iss.TABLE_NAME = 'people'

// SELECT ist.table_name, final.*
// FROM information_schema.tables AS ist
// LEFT JOIN (SELECT iss.table_schema, iss.table_name, iss.column_name, iss.is_nullable, iss.data_type, iss.udt_name, iss.is_updatable, kt.constraint_name, kt.constraint_type, kt.foreign_table_name, kt.foreign_column_name
// FROM INFORMATION_SCHEMA.COLUMNS AS iss
// LEFT JOIN (SELECT tc.constraint_name, tc.constraint_type, tc.table_name, kcu.column_name, ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name
// FROM information_schema.table_constraints AS tc
// JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
// JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
// WHERE constraint_type = 'FOREIGN KEY' OR constraint_type = 'PRIMARY KEY') AS kt
// ON iss.column_name = kt.column_name AND iss.table_name = kt.table_name) AS final
// ON final.table_name = ist.table_name
// WHERE ist.table_schema='public' AND ist.table_type='BASE TABLE'
