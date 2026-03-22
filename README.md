# SQL to NoSQL Migration Template


## Overview
Simple Node.js template to migrate data from **MSSQL (SQL)** to **MongoDB (NoSQL)**.

**Example use:** Migrates users, authors, categories from MSSQL `existing` DB.

Uses `mssql` (source), `mongoose` (target), bulk `insertMany()` with deduping.

## How DB Connections Work
- `db/mssql.js`: Connects via env vars (`MSSQL_*`).
- `db/mongo.js`: Mongoose via `MONGO_URI`.

**Migration Flow** (each `migrateX.js`):
1. Import/connect both DBs.
2. SQL query → filter dupes (Set by ID/email).
3. Map/transform fields.
4. `Model.insertMany()` (bulk, ordered:false).
5. Log counts, exit.

## Quickstart
1. **Clone & Install:**
   ```bash
   git clone <repo>
   cd migration
   npm install
   ```

2. **.env Setup (example—dummy values):**
   ```
   MSSQL_USER=dummy_user
   MSSQL_PASSWORD=dummy_password_123
   MSSQL_SERVER=dummy-server.local
   MSSQL_DATABASE=dummy_db
   MSSQL_PORT=1433

   MONGO_URI=mongodb+srv://dummy:dummy_pass@cluster0.dummy.net/dummy_db
   DB_NAME=dummy_db
   ```
   *Replace ALL with your real values!*

3. **Run Examples:**
   ```bash
   node migrateUsers.js     # Users
   node migrateAuthors.js   # Authors
   node migrateCategory.js  # Categories
   ```

**Flow:** Each runs independently—connect → query → dedupe → insert → done.



## Extend: Your Own Migration
*Change according to your own SQL database—this example uses MSSQL (Microsoft SQL).*
To migrate any table:

1. **Create Model** (`models/YourModel.js`):
   ```js
   import mongoose from 'mongoose';
   const schema = new Schema({ /* fields */ }, { strict: false });
   export default mongoose.model('yourmodels', schema);
   ```

2. **Create Script** (`migrateYourTable.js`):
   ```js
   import { connectMSSQL } from './db/mssql.js';
   import { connectMongo } from './db/mongo.js';
   import YourModel from './models/YourModel.js';
   import sql from 'mssql';

   async function migrate() {
     await connectMSSQL(); await connectMongo();
     const result = await sql.query('SELECT * FROM your_table');
     const data = result.recordset.map(row => ({ /* transform */ }));
     await YourModel.insertMany(data);
     console.log('Done!');
   }
   migrate();
   ```

3. **Run:**
   ```bash
   node migrateYourTable.js
   ```

## Structure
```
migrate*.js  # Scripts
db/          # Connections
models/      # Schemas
```

## Troubleshooting
- Env vars wrong? Check connections.
- Dupes? Add Set filter.

License: ISC

