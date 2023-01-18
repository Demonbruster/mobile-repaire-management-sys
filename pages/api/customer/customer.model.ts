import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: {
    type: String
  },
  phone: {
    // string or array of strings (phone numbers)
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

export default mongoose.models.Customer || mongoose.model("Customer", customerSchema);
