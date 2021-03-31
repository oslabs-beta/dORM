# Creating testing environment

## Please follow the instructions below prior to test this deno module:

- [ ] Go to your terminal and verify that you can run the psql command:
- [ ] Invoke `psql -d <url from elephantSQL> -f ./test_suite/db_test_postgres_create.sql`. This will open the connection to your database and execute the SQL statements that will create tables in your database and populate them with rows of data. Make sure you let the script run all the way through. It will take a minute or two.
- [ ] please create a userprofile table before testing it if you use your own database.
      _(will be updating this part after adding create table method.)_

## Running all tests at once:

- Invoke `deno test --allow-net --unstable` in your terminal. Make sure to check deno version to be latest version to run the test.

### Select test file is completed. Testing includes the following:

- [x] Invalid query checking
- [x] Single-column query checking
- [x] Multiple-column query checking
- [x] The whole table select query checking
- [x] Only one method for each query checking

### Insert test file is completed. Testing includes the following:

- [x] Invalid query checking
- [x] Single-row query checking
- [x] Multiple-rows query checking
- [x] The whole table insert query checking
- [x] Only one method for each query checking

### Update test file is completed. Testing includes the following:

- [x] ALL queries to be valid checking
- [x] Single-row query checking
- [x] Multiple-rows query checking
- [x] The whole table update query checking
- [x] Only one method for each query checking

### Delete test file is completed. Testing includes the following:

- [x] ALL queries to be valid checking
- [x] Single-row query checking
- [x] Multiple-rows query checking
- [x] Deleting all rows of the table query checking
- [x] Only one method for each query checking
