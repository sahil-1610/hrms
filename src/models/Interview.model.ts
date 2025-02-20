// Interview.model.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface InterviewDocument extends Document {
  candidate: mongoose.Types.ObjectId; // Reference to the candidate (Person)
  vacancy?: mongoose.Types.ObjectId; // Optional: Reference to the vacancy
  interviewDate: Date;
  interviewTime: string;
  additionalNotes?: string;
  status: "scheduled" | "completed" | "cancelled";
}

const InterviewSchema: Schema<InterviewDocument> = new Schema(
  {
    candidate: { type: Schema.Types.ObjectId, ref: "Person", required: true },
    vacancy: { type: Schema.Types.ObjectId, ref: "Vacancy" },
    interviewDate: { type: Date, required: true },
    interviewTime: { type: String, required: true },
    additionalNotes: { type: String },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  { timestamps: true },
);

const Interview: Model<InterviewDocument> =
  mongoose.models.Interview ||
  mongoose.model<InterviewDocument>("Interview", InterviewSchema);

export default Interview;
