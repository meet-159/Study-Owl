import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["query", "share","notify"],
    },
    read: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      required: true,
    },
    toUser: {
      username: { type: String, required: true },
      email: { type: String, required: true },
    },
    fromUser: {
      username: { type: String, required: true },
      email: { type: String, required: true },
    },
  },
  { timestamps: true }
);

// Creating and exporting the model
const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
