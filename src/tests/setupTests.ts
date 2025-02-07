import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();


  console.log(mongoose.connection.readyState, "state");
  if (mongoose.connection.readyState === 0) { 
    await mongoose.connect(uri, {});
    console.log("MongoDB Connected for Tests");
  }
});

afterEach(async () => {
  if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
  console.log("Database cleared after test");
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
  console.log("MongoDB Disconnected After All Tests");
});
