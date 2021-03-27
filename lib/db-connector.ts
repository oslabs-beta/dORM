import { Pool, PoolClient } from '../deps.ts';
// import { dormURL } from './test.ts';
// import { dorm } from './test.ts';

const config =
  'postgres://jkwfgvzj:lB9v6K93eU1bjY75YaIzW3TnFMN2PlLF@ziggy.db.elephantsql.com:5432/jkwfgvzj';

//const config = dorm.url;
const pool = new Pool(config, 3);

export { pool, PoolClient };
// export dorm  extends { pool, PoolClient };
