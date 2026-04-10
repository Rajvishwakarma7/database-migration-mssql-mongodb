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

    //     const result = await sql.query(`
    //       SELECT DISTINCT
    //  sp.shoppingTransactionID, sp.shoppingStateID, sp.UserId,sp.price1,sp.price2,sp.count,sp.unlimitedAccessInLibrary,sp.count,
    //  st.createDate,st.amount,st.holdBalance,st.tranID,st.comment,st.response,st.chargetype,st.transactionState
    // FROM [aishaudiodb2].[dbo].[Shopping] sp
    // INNER JOIN [aishaudiodb2].[dbo].[ShoppingTransaction] st
    // ON sp.shoppingTransactionID = st.shoppingTransactionID
    // WHERE st.chargetype IS NOT NULL;

    //     `);

    //     const transactions = result.recordset.map((row) => {
    //       return {
    //         sqlUserId: row.UserId,

    //         transactionId: row.shoppingTransactionID,

    //         amount: parseFloat(row.amount) || 0,
    //         holdBalance: parseFloat(row.holdBalance) || 0,

    //         type: row.chargetype,

    //         // ✅ Status mapping
    //         status:
    //           row.shoppingStateID === 3
    //             ? "failed"
    //             : "success",

    //         transactionDate: row.createDate,

    //         paymentToken:row.tranID,

    //         // ✅ preserve original time
    //         createdAt: row.createDate,
    //         updatedAt: row.createDate,
    //         response: row.response,
    //         comment: row.comment,
    //         shoppingStateID: row.shoppingStateID,

    //       };
    //     });

    //     const inserted = await ETransaction.insertMany(transactions, {
    //       ordered: false,
    //     });

    //     console.log("Inserted transactions:", inserted.length);

    // const eSubTransactions = await ESubscription.find();

    // for (const tx of eSubTransactions) {
    //   const userData = await Users.findOne({ _id: tx.userId });
    //   if (userData) {
    //     const result = await ETransaction.updateMany(
    //       { sqlUserId: userData.UserId },
    //       { $set: { userId: userData._id } },
    //     );
    //     console.log(
    //       "Updated transactions for userId:",
    //       tx.userId,
    //       "Matched count:",
    //       result.matchedCount,
    //       "Modified count:",
    //       result.modifiedCount,
    //     );
    //   }
    // }



    console.log("Migration complete");

    process.exit(0);
  } catch (error) {
    console.error("Error migrating transactions:", error);
    process.exit(1);
  }
}

migrateTransactions();
