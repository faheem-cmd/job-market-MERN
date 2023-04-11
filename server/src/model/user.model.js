import mongoose from "mongoose";
const userModel = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: false },
    image: { type: String },
    phone: { type: String, required: true },
    employer: { type: Boolean, required: true },
    password: { type: String, required: true },
    access_token: { type: String, default: "" },
    refresh_token: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userModel);
export default User;
