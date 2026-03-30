import { connectMSSQL } from "./db/mssql.js";
import { connectMongo } from "./db/mongo.js";
import User from "./models/User.js";
import sql from "mssql";

async function migrateUsers() {
  try {
    await connectMSSQL();
    await connectMongo();

    // ✅ Updated SQL (deduplicated + 3 tables)
    const result = await sql.query(`
      SELECT *
      FROM (
          SELECT  
              ms.UserId,
              ms.firstName,
              ms.lastName,
              ms.country,
              ms.state,
              ms.city,
              ms.postalCode,
              ms.phone,
              ms.refferedBy,
              ms.freeOfferCnt,
              ms.balance,
              ms.subscribeActivation,
              ms.firstActivation,

              asm.Email AS email,
              asm.CreateDate,
              asm.LastLoginDate,
              asm.IsApproved,

              ROW_NUMBER() OVER (
                  PARTITION BY LOWER(LTRIM(RTRIM(asm.Email)))
                  ORDER BY asm.CreateDate DESC
              ) AS rn

          FROM dbo.Membership ms
          INNER JOIN dbo.aspnet_Users au 
              ON ms.UserId = au.UserId
          INNER JOIN dbo.aspnet_Membership asm 
              ON ms.UserId = asm.UserId

          WHERE asm.Email IS NOT NULL
            AND LTRIM(RTRIM(asm.Email)) <> ''
      ) t
      WHERE t.rn = 1
      ORDER BY t.CreateDate DESC;
    `);

    console.log("Total users (deduplicated):", result.recordset.length);

    const DEFAULT_ROLE = "696623359d3e61fdd99d3f48";

    // ✅ Fetch existing emails to avoid duplicate inserts
    const existingUsers = await User.find({}, { email: 1 });
    const existingEmailSet = new Set(
      existingUsers.map((u) => u.email.toLowerCase())
    );

    const users = result.recordset
      .filter((u) => {
        const email = u.email?.trim().toLowerCase();
        return email && !existingEmailSet.has(email);
      })
      .map((u) => {
        return {
          ...u, // ✅ keep all extra SQL fields (strict: false)

          email: u.email.toLowerCase(),
          firstName: u.firstName,
          lastName: u.lastName,
          password: "TEMP_PASSWORD", // ⚠️ you can improve later
          roleId: DEFAULT_ROLE,

          phone: u.phone || null,
          address: u.postalAdderss || null, // if exists
          city: u.city,
          state: u.state,
          country: u.country,
          zip: u.postalCode,

          referredBy: u.refferedBy, // ✅ mapped correctly
          isVerified: u.IsApproved === true,

          // Optional mappings
          notes: null,
        };
      });

    if (users.length === 0) {
      console.log("No new users to insert");
      process.exit();
    }

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