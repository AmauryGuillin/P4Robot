import mongoose from "mongoose";

const mongoDbUrl = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017"; //by default

console.log(`mongoDbUrl = ${mongoDbUrl}`);

mongoose.connect(mongoDbUrl, {
  userNewUrlParser: true,
  useUnifiedTopology: true,
  user: "amaury",
  pass: "motdepasse",
  dbName: "Project4Name",
});

var thisDb = mongoose.connection;

thisDb.on("error", () => {
  console.log(`mongoDB connection error for dbUrl = ${mongoDbUrl}`);
});

thisDb.once("open", () => {
  console.log("Connected correctly to mongoDB database");
});

export default { thisDb };
