import { connectMSSQL } from "./db/mssql.js";
import { connectMongo } from "./db/mongo.js";
import sql from "mssql";
import ETransaction from "./models/ETransaction.js";
import Users from "./models/User.js";
import ESubscription from "./models/ESubscription.js";

async function migrateTransactions() {
  try {
    await connectMSSQL();
    await connectMongo();

//     const result = await sql.query(
//       `
//       SELECT 
//     st.shoppingTransactionID as shopID,
//     st.createDate,
//     st.amount,
//     st.holdBalance,

//     st.chargetype,
//     st.response,
//     st.tranID as transactionId,
//     m.tranID,
//     m.shoppingTransactionID,

//     mp.UserId
 
// FROM dbo.MembershipXrefSubscribePlan mp
//  JOIN dbo.MembershipCart m
//     ON mp.UserId = m.UserId
//  JOIN dbo.ShoppingTransaction st
//     ON st.shoppingTransactionID = m.shoppingTransactionID
// WHERE st.chargetype ='authorize'
//       `,
//     );

//     const transactions = result.recordset.map((row) => {
//       return {
//         sqlUserId: row.UserId,

//         transactionId: row.shoppingTransactionID,

//         amount: parseFloat(row.amount) || 0,
//         holdBalance: parseFloat(row.holdBalance) || 0,

//         type: row.chargetype,

//         // ✅ Status mapping
//         status: row.response === "Y" ? "success" : "failed",

//         transactionDate: row.createDate,

//         paymentToken: row.transactionId,

//         // ✅ preserve original time
//         createdAt: row.createDate,
//         updatedAt: row.createDate,
//         response: row.response,
//       };
//     });

//     const inserted = await ETransaction.insertMany(transactions, {
//       ordered: false,
//     });

//     console.log("Inserted transactions:", inserted.length);

    // step2 -----------------------------------------------------

    const eTransactions = await ETransaction.find();

    for (const tx of eTransactions) {
      const userData = await Users.findOne({ UserId: tx.sqlUserId });
      if (userData) {
        const result = await ETransaction.updateMany(
          { sqlUserId: userData.UserId },
          { $set: { userId: userData._id } },
        );
        console.log(
          "Updated transactions for userId:",
          tx.userId,
          "Matched count:",
          result.matchedCount,
          "Modified count:",
          result.modifiedCount,
        );
      }
    }

    console.log("Migration complete");

    process.exit(0);
  } catch (error) {
    console.error("Error migrating transactions:", error);
    process.exit(1);
  }
}

migrateTransactions();
