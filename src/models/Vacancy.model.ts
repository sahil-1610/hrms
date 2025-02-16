import mongoose, { Schema, Document, Model } from "mongoose";

export interface VacancyDocument extends Document {
  vacancyName: string;
  jobTitle: string;
  description: string;
  positions: number;
  isActive: boolean;
  hiringManager: string; // New field for Hiring Manager
}

const VacancySchema: Schema<VacancyDocument> = new Schema(
  {
    vacancyName: { type: String, required: true },
    jobTitle: { type: String, required: true },
    description: { type: String, required: true },
    positions: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    hiringManager: { type: String, required: true }, // New field added here
  },
  { timestamps: true },
);

const Vacancy: Model<VacancyDocument> =
  mongoose.models.Vacancy ||
  mongoose.model<VacancyDocument>("Vacancy", VacancySchema);

export default Vacancy;
