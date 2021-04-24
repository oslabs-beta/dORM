import { config } from '../deps.ts';
import { query, poolConnect } from '../lib/db-connectors/pg-connector.ts';
import generator from './generator-helper.ts';

const env = config();

const url = env.dorm_databaseURL;

poolConnect(url);

const __dirname = new URL('.', import.meta.url).pathname;

const modelQuery = Deno.readTextFileSync(`${__dirname}relationships.sql`);

const informationSchema = await query(modelQuery);

const databaseTables = generator(informationSchema.rows);

Deno.mkdirSync('./dorm', { recursive: true });

Object.keys(databaseTables).forEach((table) => {
  const tablePrettier = JSON.stringify(databaseTables[table], null, 2).replace(
    /"([^"]+)":/g,
    '$1:'
  );

  const modelFileText = `MODEL IS STILL UNDER CONSTRUCTION SORRY!!\n\nimport { Model } from 'https://deno.land/x/dorm/mod.ts';\n\nconst ${table} = new Model('${table}', ${tablePrettier})\n\nexport default ${table};`;

  /**
   * Make directory in the root folder and create model files inside 'dorm' directory
   */
  Deno.writeTextFileSync(`dorm/${table}.ts`, modelFileText);
  console.log(`DORM: created <${table}> model file`);
});
