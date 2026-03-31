import { connectMSSQL } from "./db/mssql.js";
import { connectMongo } from "./db/mongo.js";
import sql from "mssql";
import ETransaction from "./models/ETransaction.js";
import Users from "./models/User.js";

async function migrateTransactions() {
  try {
    await connectMSSQL();
    await connectMongo();

    // const result = await sql.query(`
    //   SELECT 
    //     mc.UserId,
    //     mc.membershipCartID,
    //     mc.cartStateID,
    //     mc.expirationDate,
    //     mc.cartTypeID,
    //     mc.tranID as cartTranID,

    //     st.shoppingTransactionID,
    //     st.createDate,
    //     st.amount,
    //     st.holdBalance,
    //     st.tranID,
    //     st.comment,
    //     st.response,
    //     st.chargetype,
    //     st.transactionState

    //   FROM dbo.MembershipCart mc
    //   INNER JOIN dbo.ShoppingTransaction st
    //   ON mc.shoppingTransactionID = st.shoppingTransactionID
    // `);

    // const transactions = result.recordset.map((row) => {
    //   return {
    //     userId: row.UserId,

    //     transactionId: row.shoppingTransactionID,

    //     amount: parseFloat(row.amount) || 0,
    //     holdBalance: parseFloat(row.holdBalance) || 0,

    //     type: row.chargetype,

    //     // ✅ Status mapping
    //     status:
    //       row.transactionState === 2
    //         ? "success"
    //         : "failed",

    //     gateway: {
    //       name: "eProcessingNetwork",
    //       transactionId: row.tranID || row.cartTranID,
    //       response: row.response,
    //     },

    //     cart: {
    //       membershipCartID: row.membershipCartID,
    //       cartStateID: row.cartStateID,
    //       cartTypeID: row.cartTypeID,
    //       expirationDate: row.expirationDate,
    //     },

    //     transactionDate: row.createDate,

    //     // ✅ preserve original time
    //     createdAt: row.createDate,
    //     updatedAt: row.createDate,
    //   };
    // });

    // const inserted = await ETransaction.insertMany(transactions, {
    //   ordered: false,
    // });

    // console.log("Inserted transactions:", inserted.length);

    // const transactions = await ETransaction.find({});
    // console.log("Total transactions in MongoDB:", transactions.length);

    // for (const tx of transactions) {
    //   console.log(`Transaction ID: ${tx.transactionId}, Amount: ${tx.amount}, Status: ${tx.status}`);
    //     const userData = await Users.findOne({ UserId: tx.userId });
    //       if(userData){
    //           tx.userRef = userData._id.toString();
    //           await tx.save();
    //           console.log(`User ${tx?.userRef} has ${tx.userId} transactions`);
    //       }
    // }

    console.log("Migration complete");

    process.exit(0);
  } catch (error) {
    console.error("Error migrating transactions:", error);
    process.exit(1);
  }
}

migrateTransactions();