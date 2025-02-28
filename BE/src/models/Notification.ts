import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    actionMaker: {type: mongoose.Types.ObjectId, required: true, ref: "User"},
    post: {type: mongoose.Types.ObjectId, ref: "Post"},
    comment: {type: mongoose.Types.ObjectId, ref: "Comment"},
    createdAt: {type: Date, default: Date.now},
    isRead: {type: Boolean, default: false},
    type: { "type": String, required: true, "enum": [
        "liked your post",
        "liked your comment",
        "commented on your post",
        "started following you"
    ]},
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
    