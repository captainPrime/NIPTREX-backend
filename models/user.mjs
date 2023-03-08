import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    dateOfBirth: Date,
});

const User = mongoose.model("User", UserSchema);

export default User;
