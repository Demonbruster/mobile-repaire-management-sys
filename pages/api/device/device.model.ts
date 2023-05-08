import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  model: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Model",
    required: false,
  },
  imei: {
    type: String,
  },
  color: {
    type: String,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
});

export default mongoose.models.Device || mongoose.model("Device", deviceSchema);
