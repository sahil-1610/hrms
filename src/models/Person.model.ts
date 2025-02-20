import mongoose, { Schema, Document, Model } from "mongoose";
import Vacancy from "@/models/Vacancy.model";

export interface EmailHistoryEntry {
  emailId: string;
  subject: string;
  body: string;
  sentDate: Date;
  direction: "sent" | "received";
}

export interface ActivityEntry {
  id: number;
  date: Date;
  type: string;
  description: string;
  performance: number; // rating from 1-5
}

export interface PersonDocument extends Document {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  experience: string;
  linkedIn?: string;
  role: "candidate" | "employee";
  status: "active" | "inactive";
  resume?: string;
  profileImage?: string;
  vacancyId?: mongoose.Types.ObjectId;
  candidateData?: {
    applicationStatus: boolean;
    notes: string;
  };
  employeeData?: {
    department?: string;
    hireDate?: Date;
    performanceScore?: string;
  };
  emailHistory?: EmailHistoryEntry[];
  activities?: ActivityEntry[];
  letters?: mongoose.Types.ObjectId[]; // Reference to letters (OfferLetter/AppointmentLetter)
}

const PersonSchema: Schema<PersonDocument> = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    education: { type: String, required: true, trim: true },
    experience: { type: String, required: true, trim: true },
    linkedIn: { type: String, trim: true },
    role: { type: String, enum: ["candidate", "employee"], required: true },
    status: { type: String, enum: ["active", "inactive"], required: true },
    resume: { type: String },
    profileImage: { type: String },
    vacancyId: { type: Schema.Types.ObjectId, ref: "Vacancy" },
    candidateData: {
      applicationStatus: { type: Boolean },
      notes: { type: String, trim: true },
    },
    employeeData: {
      department: { type: String, trim: true },
      hireDate: { type: Date },
      performanceScore: { type: String, trim: true },
    },
    emailHistory: [
      {
        emailId: { type: String, required: true, trim: true },
        subject: { type: String, required: true, trim: true },
        body: { type: String, required: true },
        sentDate: { type: Date, required: true },
        direction: { type: String, enum: ["sent", "received"], required: true },
      },
    ],
    activities: [
      {
        id: { type: Number, required: true },
        date: { type: Date, required: true },
        type: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        performance: { type: Number, required: true },
      },
    ],
    // This field stores references to letter documents from the "Letter" collection
    letters: [{ type: Schema.Types.ObjectId, ref: "Letter", default: [] }],
  },
  { timestamps: true },
);

const Person: Model<PersonDocument> =
  mongoose.models.Person ||
  mongoose.model<PersonDocument>("Person", PersonSchema);

export default Person;
