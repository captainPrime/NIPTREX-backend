import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fname: String,
    lname: String,
    email: String,
    password: String,
    country: String,
});

const User = mongoose.model("User", UserSchema);

export default User;
