import mongoose from "mongoose";

let isConnected: boolean = false; // global connection state

export async function connectToDB() {
  if (isConnected) {
    console.log("✅ Already connected");
    return;
  }

  if (mongoose.connections.length > 0) {
    const existingConnection = mongoose.connections[0];
    if (existingConnection.readyState === 1) {
      isConnected = true;
      console.log("✅ Reusing existing database connection");
      return;
    }

    if (existingConnection.readyState === 2) {
      console.log("⌛ Connection is in progress...");
      return;
    }
  }

  try {
    await mongoose.connect(process.env.MONGO_URI!, {
      dbName: "myOddoApp",
    });
    isConnected = true;
    console.log("🚀 New DB connection established");
  } catch (error) {
    console.error("❌ Database connection error:", error);
  }
}
