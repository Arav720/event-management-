import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "organizer"], default: "user" },
    events: [ { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true } ]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;