import { connectMSSQL } from "./db/mssql.js";
import { connectMongo } from "./db/mongo.js";
import Author from "./models/Author.js";
import sql from "mssql";

async function migrateAuthors() {
  try {
    await connectMSSQL();
    await connectMongo();

    const result = await sql.query(`
   SELECT 
    se.description,
    se.contactInfo,
    ei.title AS speaker_name,
    ei.active,
    fe.filePath,
    fe.alternateFilePath,
       
    se.speakerID,
    ei.entityID,
    eitem.parentEntityID,
    fe.fileID

FROM dbo.SpeakerEntity se

JOIN dbo.EntityItem ei
ON se.speakerID = ei.entityID

LEFT JOIN dbo.EntityItem eitem
ON se.speakerID = eitem.parentEntityID

LEFT JOIN dbo.FileEntity fe
ON eitem.entityID = fe.fileID
    
    `);

    const speakerIDSet = new Set();

    const authors = result.recordset
      .filter((u) => {
        const speakerID = u.speakerID;

        if (speakerIDSet.has(speakerID)) return false;

        speakerIDSet.add(speakerID);
        return true;
      })
      .map((row) => {
        console.log(row);
        return {
          ...row,
          fullName: row.speaker_name,
          bio: row.description,
          profilePicture: row.filePath || null,
          contactInfo: row.contactInfo,
          isActive: row.active === 1,
        };
      });

    const inserted = await Author.insertMany(authors, { ordered: false });

    console.log("Inserted authors:", inserted.length);
    console.log("Migration complete");

    process.exit(0);
  } catch (error) {
    console.error("Error migrating authors:", error);
    process.exit(1);
  }
}

migrateAuthors();
