import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@login-signup-cluster.lxq8zem.mongodb.net/?retryWrites=true&w=majority`;

const connectMongoDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: "NiptrexUsers",
        });
        console.log("DB Connected");
    } catch (err) {
        console.error(err);
    }
};

export default connectMongoDB;
