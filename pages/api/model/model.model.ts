import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brand:{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand'
  }
});

export default mongoose.models.Brand || mongoose.model("Brand", brandSchema);
