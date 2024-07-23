import mongoose from "mongoose";


// This function is responsible for connnecting to MongoDB database
const connectToMongoDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_DB_URI,{
			dbName : "MongoDbAggregationPipeline",
		});
		console.log("Connected to MongoDB with URI: " + conn.connection.host);
	} catch (error) {
		console.log("Error connecting to MongoDB", error.message);
	}
};

export default connectToMongoDB;