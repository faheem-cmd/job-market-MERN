import mongoose from "mongoose";
const friendsModel = new mongoose.Schema({
  myId: { type: String, required: true },
  friendId: { type: String, required: true },
});

const Friends = mongoose.model("Friends", friendsModel);
export default Friends;
