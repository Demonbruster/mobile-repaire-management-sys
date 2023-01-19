import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  model: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Model",
  },
  imei: {
    type: String,
  },
  color: {
    type: String,
  },
});

export default mongoose.models.Device || mongoose.model("Device", deviceSchema);
