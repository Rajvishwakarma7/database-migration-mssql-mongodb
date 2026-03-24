import { connectMSSQL } from "./db/mssql.js";
import { connectMongo } from "./db/mongo.js";
import sql from "mssql";
import Classes from "./models/Class.js";
import Author from "./models/Author.js";
import Category from "./models/Category.js";
import ClassCategory from "./models/ClassCategory.js";

async function migrateData() {
  try {
    await connectMSSQL();
    await connectMongo();

    // migrate classes -------------------------step1-----------------------------

    // const result = await sql.query(`
    // SELECT * FROM dbo.ClassEntity ce
    // JOIN dbo.EntityItem ei
    //     ON ce.classID = ei.entityID
    // `);
    // console.log(result);
    // const objIdSet = new Set();

    // const categories = result.recordset
    //   .filter((u) => {
    //     const classID = u.classID;

    //     if (objIdSet.has(classID)) return false;

    //     objIdSet.add(classID);
    //     return true;
    //   })
    //   .map((row) => {

    //     return {
    //         title: row.title,
    //         description: row.description,
    //         entityID: row.entityID,
    //         speakerID: row.speakerID,
    //         classID: row.classID,
    //         statDownloadCnt: row.statDownloadCnt,
    //         statListenCnt: row.statListenCnt,
    //         createDate: row.createDate,
    //         duration: row.duration,
    //         isActive: row.active,
    //         isDeleted: row.deleted
    //     }

    //   });

    // const inserted = await Classes.insertMany(categories, { ordered: false });

    // console.log("Inserted categories:", inserted.length);
    // console.log("Migration complete");

    // add authorId in class form author by speaker id ---------------step2--------
    // const classes = await Classes.find();

    // for (const c of classes) {
    //   const speaker = await Author.findOne({ speakerID: c.speakerID });
    //   console.log("speaker", speaker);
    //   if (speaker) {
    //     c.authorId = speaker._id;
    //     await c.save();
    //   }
    // }

    // add class mp3 and image -----------------------------------step3--------

    // const clasess = await Classes.find();

    // for (const c of clasess) {
    //   const result = await sql.query(`
    //   SELECT *
    // FROM dbo.EntityItem ei
    // LEFT JOIN dbo.FileEntity fe
    //   ON ei.entityID = fe.fileID
    // WHERE ei.parentEntityID = ${c.entityID}

    // `);

    //   const records = result?.recordset;
    //   let audioFile = null;
    //   let audioProfile = null;

    //   if (records && Array.isArray(records) && records.length > 0) {
    //     for (const item of records) {
    //       if (item.fileTypeID === 2) {
    //         // MP3
    //         audioFile = item.filePath;
    //       }

    //       if (item.fileTypeID === 1) {
    //         // Image
    //         audioProfile = item.filePath;
    //       }
    //     }
    //   }

    //   await Classes.updateOne(
    //     { _id: c._id },
    //     {
    //       $set: {
    //         audioFile,
    //         audioProfile,
    //       },
    //     },
    //   );

    //   console.log(`Updated class ${c._id}`);
    // }

    // add category/tags id in classCategory -----------------------step4--------

    // const Categories = await Category.find();

    // for (const cat of Categories) {
    //   const result = await sql.query(`
    //   SELECT *
    // FROM dbo.TagXrefEntity txe

    // WHERE txe.tagID = ${cat.tagID}
    // `);

    // const records = result?.recordset;
    //   if(records && Array.isArray(records) && records.length > 0){
    //     for (const item of records) {
    //       const classObj = await Classes.findOne({ classID: item.entityID });
    //       if(classObj){
    //        const classCategory = await ClassCategory.create({
    //             classId: classObj._id,
    //             categoryId: cat._id,
    //             entityID: item.entityID,
    //             tagID: item.tagID
    //         })
    //         console.log(`classCategory joined  ${classCategory._id}`);
    //       }
    //     }
    //   }
    // }

    // migrate field for class is free or not --------------------step5--------

    // const result = await sql.query(
    //   `
    //   SELECT *
    //   from dbo.CatalogItemXrefPortal
    //   WHERE isVisible =1
    //   `

    // )
    // for(const item of result.recordset){

    //   const classObj = await Classes.findOne({ classID: item.catalogItemID });
    //   if(classObj){
    //     await Classes.updateOne(
    //       { _id: classObj._id },
    //       {
    //         $set: {
    //           classType: item.isFree === 1 ? "paid" : "free"
    //         },
    //       },
    //     );
    //     console.log(`Updated class ${classObj._id} ${classObj.classType} ${item.isFree} ${item.catalogItemID}`);
    //   }
    // }

    // migrate field for class is free or not --------------------step6--------

    // const result = await sql.query(
    //   `
    //   SELECT * 
    //   from dbo.ClassEntity
    //   `,
    // );
    const result = await sql.query(`
  SELECT 
    *,
    DATEDIFF(SECOND, '00:00:00', duration) AS durationSeconds
  FROM dbo.ClassEntity
`);
for (const item of result.recordset) {
  const totalSeconds = item.durationSeconds || 0;

  // console.log(totalSeconds);
  // console.log(item.duration);
  // console.log(item);

  const classObj = await Classes.findOne({ classID: item.classID });

  if (classObj) {
    await Classes.updateOne(
      { _id: classObj._id },
      {
        $set: {
          durationSeconds: totalSeconds,
        },
      },
    );
    console.log(`Updated class ${classObj._id} → ${totalSeconds}s`);
  }
}

    console.log("Migration complete");
    process.exit(0);
  } catch (error) {
    console.error("Error migrating :", error);
    process.exit(1);
  }
}

migrateData();
