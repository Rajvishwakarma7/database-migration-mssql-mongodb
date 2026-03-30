import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();
console.log({
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASSWORD,
  server: process.env.MSSQL_SERVER,
  port: parseInt(process.env.PORT), 
  database: process.env.MSSQL_DATABASE
})
const config = {
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASSWORD,
  server: process.env.MSSQL_SERVER,
 port: parseInt(process.env.PORT), 
  database: process.env.MSSQL_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

export async function connectMSSQL() {
  return sql.connect(config);
}