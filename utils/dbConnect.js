import { connect, connection } from "mongoose";
import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI;

const conn = {
  isConnected: false,
};
mongoose.set('strictQuery', false);
export const dbConnect = async () => {
  try {
    if (conn.isConnected) return;
    const db = await connect(MONGODB_URI);
    conn.isConnected = db.connections[0].readyState
    // console.log(db.connection.db.databaseName)
  } catch (error) {
    console.log(error);
  }
};

connection.on("connected", () => {
  console.log("mongo db is connected");
});

connection.on("error", (err) => {
  console.log(err);
});
