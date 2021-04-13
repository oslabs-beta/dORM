---------PROBLEMS TO SOLVE----------

SELECT:
-AS:under the hood
-UNION
-GROUP BY
-ORDER BY
-LIMIT

WHERE: WHERE 'condition1' && (condition2 || condition3)

'&' OR '&&' OR 'AND'
.where('column1 = luke').and(('condition','|',condition')) ==> '|'
-AND
-OR
-NOT

.where(function() {
this.where(condition1).orWhere(condition)
}

SINGLE OBJECT, NON-ARRAY INSERT - done
ERROR FOR NO RETURNING ON SELECT - done

DELETEALL METHOD TO PREVENT DELETE WITHOUT WHERE DISASTER - done
BUILD ARRAY OF CHAINED METHOD ORDER - done
FIXED NOT SAVING ERROR MESSAGE BEFORE RESET IN .THEN - done

PROMISE INSIDE LOOP
PARAMETERIZED QUERIES?
ORM?

MAKING ALL BUILDERS INTUITIVE

// ---SELECT---
// BASE SELECT QUERY: `SELECT ${columns} FROM ${primaryTable}`

// JOINS CLAUSE: `${joinType} ${secondaryTable}`

// ON CLAUSE: `ON ${primaryColumnName} ${operator} ${secondaryColumnName}`

// WHERE CLAUSE:`WHERE ${columnName} ${operator} ${value}`

// GROUP BY CLAUSE:

// ORDER BY CLAUSE:

// ---DELETE---
// BASE DELETE QUERY: `DELETE FROM ${table}`
// WHERE CLAUSE: `WHERE ${columnName} ${operator} ${value}`
// RETURNING CLASE: `RETURNING ${columns}`

// ---DROP---
// DROP QUERY: `DROP TABLE ${table}`

// ---INSERT---
// INSERT QUERY: `INSERT INTO ${table} (${columns}) VALUES (${values})`
// RETURNING CLAUSE: `RETURNING ${columns}`

// ---UPDATE---
// UPDATE QUERY: `UPDATE ${table} SET ${columns} = ${values}`
// WHERE CLAUSE: `WHERE ${columnName} ${operator} ${value}`
// RETURNING CLAUSE: `RETURNING ${columns}`

// --LEFT JOIN--
// SELECT \* FROM people LEFT JOIN spices ON people.\_id=spices.\_id

deno run --allow-net --unstable ./lib/usertest.ts
