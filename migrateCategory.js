import { connectMSSQL } from "./db/mssql.js";
import { connectMongo } from "./db/mongo.js";
import sql from "mssql";
import Category from "./models/Category.js";

async function migrateData() {
  try {
    await connectMSSQL();
    await connectMongo();

    const result = await sql.query(`
  SELECT *
FROM dbo.Tags 

    `);

    const tagIdIDSet = new Set();

    const categories = result.recordset
      .filter((u) => {
        const tagID = u.tagID;

        if (tagIdIDSet.has(tagID)) return false;

        tagIdIDSet.add(tagID);
        return true;
      })
      .map((row) => {
        
        return row;
      });

    const inserted = await Category.insertMany(categories, { ordered: false });

    console.log("Inserted categories:", inserted.length);
    console.log("Migration complete");

    process.exit(0);
  } catch (error) {
    console.error("Error migrating categories:", error);
    process.exit(1);
  }
}

migrateData();
