import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectMongoDB = () => {
    mongoose
        .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("DB Connected");
        })
        .catch((err) => console.log(err));
};

export default connectMongoDB;
