import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserVerificationSchema = new Schema({
    user_id: String,
    unique_string: String,
    created_at: Date,
    expires_at: Date,
});

// required: true, unique: true

const UserVerification = mongoose.model("UserVerification", UserVerificationSchema);

export default UserVerification;
