import mongoose, { Schema } from "mongoose";

const blockchainLogSchema = new Schema({
  recordType: {
    type: String,
    required: true,
    enum: ["Incident", "SensorReading", "EmissionData"],
  },
  // Reference to the original document in our MongoDB
  recordId: { type: Schema.Types.ObjectId, required: true },
  // The hash of the critical data from the original document
  dataHash: { type: String, required: true, index: true },
  // The transaction ID from the external blockchain service
  blockchainTransactionId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const BlockchainLog = mongoose.model("BlockchainLog", blockchainLogSchema);
