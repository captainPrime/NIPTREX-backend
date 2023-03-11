import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fName: String,
    lName: String,
    email: String,
    password: String,
    country: String,
});

const User = mongoose.model("User", UserSchema);

export default User;
