import mongoose from "mongoose";

const dbURI = process.env.MONGODB_URI || "mongodb://localhost:27017/mbl-tracker";

export const connectDB = async () => {
	mongoose
		.connect(dbURI)
		.then(() => {
			console.log("Connected to MongoDB");
		})
		.catch((err) => {
			console.log("Error connecting to MongoDB", err);
      throw err;
		});
};
