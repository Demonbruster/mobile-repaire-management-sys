import mongoose from "mongoose";

const repairerSchema = new mongoose.Schema({
  customer:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  device:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device'
  },
  status:{
    type: String,
    required: true,
  },
  charge:{
    type: Number,
  },
  problem:{
    type: String,
  },
  notes:{
    type: String,
  },
  entryDate:{
    type: Date,
  },
  expectedDeliveryDate:{
    type: Date,
  },
  deliveryDate:{
    type: Date,
  },
});

export default mongoose.models.Repairer || mongoose.model("Repairer", repairerSchema);
