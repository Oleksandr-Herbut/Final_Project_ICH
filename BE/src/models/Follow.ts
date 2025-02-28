import mongoose from "mongoose";

const followSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    follower_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
});

const Follow = mongoose.model("Follow", followSchema);

export default Follow