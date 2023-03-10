import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: "NiptrexUsers",
        });
        console.log("DB Connected");
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

export default connectMongoDB;
