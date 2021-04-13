# Creating testing environment

## Please follow the instructions below prior to test this deno module:

- [ ] Go to your terminal and verify that you can run the psql command:
- [ ] Invoke `psql -d <url from elephantSQL> -f ./test_suite/db_test_starwars_create.sql`. This will open the connection to your database and execute the SQL statements that will create tables in your database and populate them with rows of data. Make sure you let the script run all the way through. It will take a minute or two.
- [ ] please add your database url in the url in the file you want to run.
      _(will be updating this part after adding create table method.)_

## Running all tests at once:

- Invoke `deno test --allow-net --allow-read --unstable ./test_suite/main_test.ts` in your terminal. Make sure to check deno version to be latest version to run the test.

- [x] Select method test
- [x] Insert method test
- [x] Update method test
- [x] Delete method test
- [x] Drop method test
- [x] Join method test

### Select test file is completed. Testing includes the following:

Invoke `deno test --allow-net --allow-read --unstable ./test_suite/select_test.ts` in your terminal. Make sure to check deno version to be latest version to run the test.

- [x] Query Validation test
- [x] Single-column query test
- [x] Multiple-column query test
- [x] The whole table select query test
- [x] Multiple actions validation test

### Insert test file is completed. Testing includes the following:

Invoke `deno test --allow-net --allow-read --unstable ./test_suite/insert_test.ts` in your terminal. Make sure to check deno version to be latest version to run the test.

- [x] Query Validation test
- [x] Single-row query test
- [x] Multiple-rows query test

### Update test file is completed. Testing includes the following:

Invoke `deno test --allow-net --allow-read --unstable ./test_suite/update_test.ts` in your terminal. Make sure to check deno version to be latest version to run the test.

- [x] Single-row query test
- [x] Multiple-rows query test
- [x] The whole table update query test

### Delete test file is completed. Testing includes the following:

Invoke `deno test --allow-net --allow-read --unstable ./test_suite/delete_test.ts` in your terminal. Make sure to check deno version to be latest version to run the test.

- [x] Query Validation test
- [x] Single-row delete query test
- [x] Multiple-rows delete query test
- [x] Delete all rows using dorm.delete() test

### Drop test file is completed. Testing includes the following:

Invoke `deno test --allow-net --allow-read --unstable ./test_suite/drop_test.ts` in your terminal. Make sure to check deno version to be latest version to run the test.

- [x] Query Validation test

### Join test file is completed. Testing includes the following:

Invoke `deno test --allow-net --allow-read --unstable ./test_suite/join_test.ts` in your terminal. Make sure to check deno version to be latest version to run the test.

- [x] Two table Join test
- [x] Multiple-tables Join test
- [x] Without on condition test
- [x] Calling on without Table test
