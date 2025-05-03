import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema({
    groupId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Group || mongoose.model("Group", GroupSchema);
