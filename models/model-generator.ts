import { config } from '../deps.ts';
import { query, poolConnect } from '../lib/db-connectors/pg-connector.ts';
import generator from './generator-helper.ts';

const env = config();

const url = env.dorm_databaseURL;

poolConnect(url);

// const modelQuery = Deno.readTextFileSync('models/relationships.sql');

const modelQuery = `SELECT ist.table_name, crt.*
FROM information_schema.tables AS ist
LEFT JOIN 
  (SELECT isc.table_schema, isc.table_name, isc.column_name, isc.ordinal_position, isc.column_default, isc.is_nullable, isc.data_type, isc.udt_name, isc.is_updatable, 
          pfkt.constraint_name, pfkt.constraint_type, pfkt.foreign_table_name, pfkt.foreign_column_name
    FROM INFORMATION_SCHEMA.COLUMNS AS isc
    LEFT JOIN 
      (SELECT istc.constraint_name, istc.constraint_type, istc.table_name, kcu.column_name, ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name 
        FROM information_schema.table_constraints AS istc 
        JOIN information_schema.key_column_usage AS kcu 
        ON istc.constraint_name = kcu.constraint_name 
        JOIN information_schema.constraint_column_usage AS ccu 
        ON ccu.constraint_name = istc.constraint_name 
        WHERE constraint_type = 'FOREIGN KEY' OR constraint_type = 'PRIMARY KEY') AS pfkt 
    ON isc.column_name = pfkt.column_name AND isc.table_name = pfkt.table_name) AS crt
ON crt.table_name = ist.table_name
WHERE ist.table_schema='public' AND ist.table_type='BASE TABLE'
ORDER BY ist.table_name, crt.ordinal_position`;

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
