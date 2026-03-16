import { connectMSSQL } from "./db/mssql.js";
import { connectMongo } from "./db/mongo.js";
import User from "./models/User.js";
import sql from "mssql";

async function migrateUsers() {
  try {
    await connectMSSQL();
    await connectMongo();

    const result = await sql.query(`
    SELECT * FROM aish613com.all_users
  `);

    console.log("Total users:", result.recordset.length);

    const DEFAULT_ROLE = "696623359d3e61fdd99d3f48";

    const emailSet = new Set();

const users = result.recordset
  .filter((u) => u.email && u.email.trim() !== "")
  .filter((u) => {
    const email = u.email.trim().toLowerCase();

    if (emailSet.has(email)) {
      return false;
    }

    emailSet.add(email);
    return true;
  })
  .map((u) => ({
    ...u,
    email: u.email.toLowerCase(),
    firstName: u.fname,
    lastName: u.lname,
    password: u.pw || "TEMP_PASSWORD",
    roleId: DEFAULT_ROLE,
    phone: u.homephone || u.dayphone,
    address: u.address1,
  }));

    const inserted = await User.insertMany(users, { ordered: false });
    console.log("Inserted users:", inserted.length);
    console.log("Migration complete");
    process.exit();
  } catch (error) {
    console.log("Error:", error);
    process.exit(1);
  }
}

migrateUsers();