// models/HR.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface HRDocument extends Document {
  name: string;
  email: string;
  phone?: string;
  password: string;
  profileImage?: string;
  position?: string;
  department?: string;
  experience?: string;
  about?: string;
}

const HRSchema: Schema<HRDocument> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // For login, phone is not required; default to an empty string.
    phone: { type: String, default: "" },
    password: { type: String, required: true },
    // Default profile image (can be updated later)
    profileImage: { type: String, default: "/images/user/user-06.png" },
    // Optional fields for HR profile details
    position: { type: String, default: "" },
    department: { type: String, default: "" },
    experience: { type: String, default: "" },
    about: { type: String, default: "" },
  },
  { timestamps: true },
);

const HR: Model<HRDocument> =
  mongoose.models.HR || mongoose.model<HRDocument>("HR", HRSchema);
export default HR;
