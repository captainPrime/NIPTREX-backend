import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    country: String,
    verified: Boolean,
});

// required: true, unique: true

const User = mongoose.model("User", UserSchema);

export default User;
