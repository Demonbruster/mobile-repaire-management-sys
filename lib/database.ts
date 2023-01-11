import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/mbl-tracker").then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.log("Error connecting to MongoDB", err);
});


const db = mongoose.connection;

export default db;
