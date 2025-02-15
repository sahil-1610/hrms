// models/EmailHistory.ts
import mongoose, { Schema, Document, Model } from "mongoose";
import { ObjectId } from "mongodb";

export interface EmailHistoryDocument extends Document {
  personId: ObjectId; // Reference to the Person document
  subject: string;
  body: string;
  sentDate: Date;
  direction: "sent" | "received";
}

const EmailHistorySchema: Schema<EmailHistoryDocument> = new Schema(
  {
    personId: { type: Schema.Types.ObjectId, ref: "Person", required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    sentDate: { type: Date, default: Date.now },
    direction: { type: String, enum: ["sent", "received"], required: true },
  },
  { timestamps: true },
);

const EmailHistory: Model<EmailHistoryDocument> =
  mongoose.models.EmailHistory ||
  mongoose.model<EmailHistoryDocument>("EmailHistory", EmailHistorySchema);
export default EmailHistory;
