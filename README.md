![image](https://user-images.githubusercontent.com/16947485/114826955-194c0600-9d96-11eb-8db0-87b67944a365.png)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Website cv.lbesson.qc.to](https://img.shields.io/website-up-down-green-red/http/cv.lbesson.qc.to.svg)](http://cv.lbesson.qc.to/) [![Ask Me Anything !](https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg)](https://GitHub.com/Naereen/ama)

# What is **dORM**?

**dORM** is an uber-lightweight SQL query builder for postgreSQL and is currently being expanded into a full-fledged object-relational mapping (ORM) tool. Its purpose is to make your life easier when making SQL queries and let you write queries in familiar Javascript/Typescript syntax and dot notation. **dORM** runs in Deno, a secure runtime environment which supports Typescript out of the box and offers cloud-based package management among other great features.

You can chain our methods together, use `.then()` at the end of the query methods or simply await the results; you can even take advantage of Deno’s top-level await. **dORM** is promise-based and makes async database queries a breeze. It also handles creating the connection to the database server, using deno-postgres under the hood.

# Quick Start up guide

This guide will cover the basics of getting started with **dORM**. Later on we will explore some of **dORM**’S newest features related to object-relational mapping, but first let’s dive into some essential CRUD functionality with **dORM**’s query builder.

## Query Builder

### Database connection and initialization

### Securely connecting to the database using .env file _(**RECOMMENDED**)_

**dORM** can create an _.env_ file for you to securely hold your postgres connection string. From anywhere in your project folder, you can execute this in your terminal:

- `$deno run --allow-read --allow-write --allow-net --unstable deno.land/x/dorm/models/init.ts`

- This will create _.env_ file in your project’s root directory.
- In your project, import the **dORM** query builder with:
  - If you are using a _.env_ file, you can use config like so:
  - Instantiate the Dorm class:

```javascript
import { Dorm } from `deno.land/x/dorm@v1.0.0-beta2`;
import { config } from 'https://deno.land/x/dotenv/mod.ts';
const env = config();
const URL = `postgres://${env.USERNAME}:${env.PASSWORD}@${env.SERVER}:5432/${env.USERNAME}`;
const dorm = new Dorm(URL);
```

### Directly using dorm class

```javascript
const URL = `<your database url>`;
const dorm = new Dorm(URL);
```

## CRUD Functionality

### INSERT method

```javascript
const inserted = await dorm
  .insert([
    { name: 'Hello World', email: 'user@dorm.com' },
    { name: 'Elvis', _id: 1, age: 50 },
  ])
  .table('user')
  .returning()
  .then((data: any) => data.rows)
  .catch((e: any) => e);
```

**dORM** simplifies the process of inserting multiple values into multiple columns of a table. If you only have a single object, you can pass that in without putting it inside an array.<br>
`.returning()` with no arguments will function as returning all.
<br>
To use top level await use try catch block:

```javascript
try {
  const inserted = await dorm
  .insert([
   {
    'name':'Hello World',
    'email': 'user@dorm.com'
   },
   {
     name: 'Elvis',
     '_id': 1, age: 50
   }
   ])
  .table('user')
  .returning()
}
catch(e:any) {
console.log(e);
}
```

### SELECT method

`.where()` takes as an argument a string that defines a condition. Conditions can contain logical operators such as `AND/OR`. Currently, a value in a `.where()` string can be a string*(wrapped in single quotes)*, a number, null, or boolean. Double-quotes cannot be used inside a single-quoted string value, and neither single nor double quotes can be used anywhere else inside the condition string. Unicode tokens _(\uxxxx.)_ currently cannot be used anywhere in the condition string.

```javascript
await dorm
  .select('name')
  .from('people')
  .where('_id=1')
  .then((data: any) => {
    return data.rows;
  })
  .catch((e: any) => {
    throw e;
  });
```

If you want to use single quotes inside your single-quoted string value, use two single-quotes in a row _(using backslashes to escape)_ and be sure to use double-quotes around your `.where()` argument.

```javascript
.where("name = 'Jack \'\'Killer\'\' Chen' ");
```

### UPDATE method

The `.update()` method takes a single object, with the key/value pairs corresponding to the column names and values to update in the database.

```javascript
await dorm
  .update({ username: 'Dogs', email: 'iamnotagooddog@dogs.com' })
  .table('dropthis')
  .where('_id = 10')
  .returning()
  .then((data: any) => {
    return data.rows;
  })
  .catch((e: any) => e);
```

Our `.update()` method won’t work without a `.where()` attached. If you for some extravagant reason wanted to update your whole table in such a way, that’s fine: for your convenience and well-being, we’ve provided an `.updateAll()` method that requires (and accepts) no `.where()`.

Here is an example of updating all rows using **dORM**:

```javascript
await dorm
  .updateall({ username: 'Dogs', email: 'iamnotagooddog@dogs.com' })
  .table('dropthis')
  .returning()
  .then((data: any) => {
    return data.rows;
  })
  .catch((e: any) => e);
```

### DELETE method

Similar to `.update()` and `.updateAll()`, **dORM** has `.delete()` and `.deleteAll()`. The `.delete()` method requires a `.where()` clause, `.deleteAll()` does not. And as an extra safeguard, if you do include a `.where()` with `.deleteAll()`, **dORM** will throw an error because it can read your mind and it knows you didn’t intend to do that.

```javascript
await dorm
  .delete()
  .from('dropthis')
  .where(`_id = ${updateId}`)
  .returning()
  .then((data: any) => {
    return data;
  })
  .catch((e: any) => e);
```

### DROP method

`.drop()` for deleting tables. Pass the table as an argument to `.drop()`, or use the `.table()` method or one of its aliases: `.from()` or `.into()`. Please proceed with caution.

```javascript
await dorm
  .drop()
  .from('dropthis')
  .then((data: any) => {
    return data.rows;
  })
  .catch((e: any) => e);
```

### JOIN method

**dORM** puts several join methods at your fingertips, each with an alias.

```javascript
 .innerJoin() OR .join();
 .leftOuterJoin() OR leftJoin();
 .rightOuterJoin() OR .rightJoin();
 .fullOuterJoin() OR .fullJoin();
```

Every `.join()` must have an accompanying `.on()` method. Here’s a sample usage:

```javascript
await dorm
  .select()
  .from('people')
  .join('people_in_films')
  .on('people._id = people_in_films.person_id')
  .leftJoin('films')
  .on('people_in_films.film_id = films._id');
```

`.on()` takes a string argument that defines a condition for the `.join()`. Although it’s probably most common to put the `.on()` directly after the `.join()` it refers to, **dORM** allows you considerable leeway here. As long as the number of `.on()` methods equals the number of `.join()` methods, **dORM** is happy. It will pair them up in the order they appear, ie. the first on with the first join, second on with second join, etc.

### **_Parameterized queries_**

PostgresQL advised that all values in a query should be parameterized. Here’s how that works with **dORM**.

With the `.insert()` or `.update()` methods, the values you include will be automatically parameterized. The passed-in object and the final query string sent to the database will look something like this:

```javascript
const test = dorm
  .insert({'username':'Golden_Retreiver','password': 'golDenR','email':'iamagooddog@dogs.com'})
  .table('userprofile')
  .toObj()

//expected output-->
{
  text: "INSERT INTO userprofile (username, password, email) VALUES ($1, $2, $3)",
  values: [
    "Golden_Retreiver","golDenR","iamagooddog@dogs.com"
    ]
  }
```

For `.where()` and `.on()` arguments, **dORM** will parse the argument and parameterize any _string, number, boolean,_ or _null values._
When **dORM** queries the database, it sends the parameterized query string as the first argument, and an array of values (if any) as the second argument. Postgres handles everything from there, scrubbing the values to ensure no SQL injection can occur.

```javascript
const values = [1, ‘Bob’];
const results = await dorm.raw(‘SELECT * FROM people WHERE id = $1 OR name = $2’, values)
```

### toString and toObject Methods

Perhaps there will be times when you want to create a query, but don’t want to send it off to the database just yet. **dORM** has a couple of methods to help you with that.

A **dORM** query string is sent off to the database upon reaching a .then in the chain, or an await. You can intercept the query string with the `.toString()` method, which returns just the string with the values parameterized (ie. `'...WHERE id = $1'`). If you already have the values handy, that’s great, but if you’d want the values array returns as well, the `.toObject()` (alias .toObj) method will return an object with two properties: text and values.

```javascript
const querystring = await dorm.select().from('people').where('id = 1');

Returned: {
text: 'SELECT * FROM people WHERE id = $1',
values: [1]
};
```

### RAW

Sometimes you just can’t or don’t want to use our chainable methods to access your database. We get it. For those funky queries that our methods don’t quite _(yet)_ cover, we give you the `dorm.raw()` method. Pass in your query string and we will make the connection for you and send it off to the db server as-is. If you’ve parameterized your values—and of course you have!—you can pass your ordered values array as a second argument to `.raw()` and we’ll send that along too. This method also has aliases: `.rawr()` and `.rawrr()`, of course.

```javascript
const values = [1, 'Bob'];
const results = await dorm.raw(
  'SELECT * FROM people WHERE id = $1 OR name = $2',
  values
);
```

## ORM (**O**bject-**R**elational **M**apping)

### MODEL INSTANCES

**dORM** can create model instances from your database. Run this in your command line terminal:

```javascript
$deno run --allow-read --allow-write --allow-net --unstable deno.land/x/dorm/models/init.ts
```

This will create a _.env_ file for you in your app root directory and create place holder for database url. If the _.env_ file is already created, it will be appendeded.

```javascript
dorm_databaseURL =
  'postgresql://USERNAME:PASSWORD@localhost:5432/DATABASENAME?schema=public';
```

Replace `USERNAME`, `PASSWORD ` and `DATABASENAME` with your database information.

After the _.env_ file was created, execute the following command to get all the relations from your database*(you will also see this instruction in *.env* file)*:

```javascript
$deno run --allow-read --allow-write --allow-net --unstable deno.land/x/dorm/models/model-generator.ts
```

This will create a dorm folder containing all of your table relations as model instance files.
