import { config } from '../deps.ts';

const env = config();

const envFileText = `

# Inserted by 'dORM init':
#--------------------------------------------------------------------------
#                 DORM: PUT YOUR POSTGRES DATABASE URL HERE               |
#--------------------------------------------------------------------------

# dORM supports the native connection string format for PostgreSQL.

dorm_databaseURL='postgresql://USERNAME:PASSWORD@localhost:5432/DATABASENAME?schema=public'

# Please run the following command in your terminal to generate model : 
#    deno run --allow-read --allow-write --allow-net --unstable https://deno.land/x/dorm/models/model-generator.ts

`;

// Case 1: when user does not have .env file
// Case 2: when use does have .env file but does not have dorm setting
if (!env.dorm_databaseURL) {
  const writeEnv = Deno.writeTextFile('.env', envFileText, { append: true });
  writeEnv.then(() => console.log('DORM: .env file edited.'));
} else {
  // Case 3: when user does have .env file and also dorm setting
  console.log(
    'DORM: .env file already has a dorm_databaseURL environment variable'
  );
}
