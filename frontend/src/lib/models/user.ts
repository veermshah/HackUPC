// lib/models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String },
  groups: [{ type: String }], // lista de groupIds
  isOwner: { type: Boolean, default: false }, // nuevo campo booleano
  tripPreferences: { type: Object, default: {} },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;

