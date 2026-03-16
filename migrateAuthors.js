import { connectMSSQL } from "./db/mssql.js";
import { connectMongo } from "./db/mongo.js";
import Author from "./models/Author.js";
import sql from "mssql";

async function migrateAuthors() {
  try {
    await connectMSSQL();
    await connectMongo();

    // Fetch all authors / speakers from MSSQL
    const result = await sql.query(`
      SELECT * FROM dbo.SpeakerEntity
    `);

    console.log("Total authors:", result.recordset.length);

    // Avoid duplicates based on fullName
    const nameSet = new Set();

    const authors = result.recordset
      .filter((a) => a.fullName && a.fullName.trim() !== "")
      .filter((a) => {
        const name = a.fullName.trim();
        if (nameSet.has(name)) return false;
        nameSet.add(name);
        return true;
      })
      .map((a) => {
        const { fullName, bio, profilePicture, contactInfo, ...rest } = a;

        return {
          ...rest, // keep other MSSQL fields if needed
          fullName: fullName.trim(),
          bio: bio || "",
          profilePicture: profilePicture || "",
          contactInfo: contactInfo || "",
          isActive: true,
          isDeleted: false,
        };
      });

    const inserted = await Author.insertMany(authors, { ordered: false });

    console.log("Inserted authors:", inserted.length);
    console.log("Authors migration complete");

    process.exit();
  } catch (error) {
    console.error("Error migrating authors:", error);
    process.exit(1);
  }
}

migrateAuthors();