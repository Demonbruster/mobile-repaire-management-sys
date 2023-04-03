import mongoose from "mongoose";

const modelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brand:{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand'
  }
});

export default mongoose.models.Model || mongoose.model("Model", modelSchema);
