import { connectMSSQL } from "./db/mssql.js";
import { connectMongo } from "./db/mongo.js";
import sql from "mssql";
import ESubscription from "./models/ESubscription.js";
import Users from "./models/User.js";

async function migrateSubscriptions() {
  try {
    await connectMSSQL();
    await connectMongo();

    // const result = await sql.query(`
    //   SELECT *
    //   FROM dbo.MembershipXrefSubscribePlan
    // `);

    // const subscriptions = result.recordset.map((row) => {
    //   const now = new Date();
    //   const start = new Date(row.startSubscribeDate);
    //    const end = new Date(row.endSubscribeDate);

    //   return {
    //     userId: row.UserId,
    //     subscribePlanID: row.subscribePlanID,

    //     startSubscribeDate: row.startSubscribeDate,
    //     endSubscribeDate: row.endSubscribeDate,
    //     activationDate: row.activationDate,
    //     cancelSubscribe: row.cancelSubscribe === 1,
    //     declineSubscribe: row.declineSubscribe === 1,
    //     activationFailCnt: row.activationFailCnt || 0,

    //     createdAt: row.activationDate || row.startSubscribeDate || new Date(),
    //     updatedAt: row.activationDate || row.startSubscribeDate || new Date(),


    //      isActive: start <= now && now <= end,

      
    //   };
    // });

    // const inserted = await ESubscription.insertMany(subscriptions, {
    //   ordered: false,
    // });

    // console.log("Inserted subscriptions:", inserted.length);


    const userSubsription = await ESubscription.find({});

    for (const sub of userSubsription) {
        const userData = await Users.findOne({ UserId: sub.userId });


         if(userData){
             sub.mUserId = userData._id.toString();
             await sub.save();
             console.log(`User ${sub?.mUserId} has ${sub.userId} subscriptions`);
         }
    }
    console.log("Migration complete");
    
    process.exit(0);
  } catch (error) {
    console.error("Error migrating subscriptions:", error);
    process.exit(1);
  }
}

migrateSubscriptions();
