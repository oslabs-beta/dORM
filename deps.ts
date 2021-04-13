// DENO-POSTGRES dependecies --------------------------------------------------
export { Pool, PostgresError } from 'https://deno.land/x/postgres/mod.ts';
export { PoolClient } from 'https://deno.land/x/postgres/client.ts';
export {
  assertEquals,
  assertNotEquals,
} from 'https://deno.land/std@0.91.0/testing/asserts.ts';
export { config } from 'https://deno.land/x/dotenv/mod.ts';
