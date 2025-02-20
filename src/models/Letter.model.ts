// Letter.model.ts
import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Base interface and schema for letters.
 * Contains common fields for all letter types.
 */
export interface BaseLetterDocument extends Document {
  letterType: "offer" | "appointment";
  recipient: mongoose.Types.ObjectId;
  isSent: boolean;
  sentDate?: Date;
}

const BaseLetterSchema: Schema<BaseLetterDocument> = new Schema(
  {
    letterType: {
      type: String,
      enum: ["offer", "appointment"],
      required: true,
    },
    recipient: { type: Schema.Types.ObjectId, ref: "Person", required: true },
    isSent: { type: Boolean, default: false },
    sentDate: { type: Date },
  },
  { discriminatorKey: "letterType", timestamps: true },
);

// Create the base model (if already defined, use the existing one)
const BaseLetter: Model<BaseLetterDocument> =
  mongoose.models.Letter ||
  mongoose.model<BaseLetterDocument>("Letter", BaseLetterSchema);

/**
 * Offer Letter
 */
export interface OfferLetterDocument extends BaseLetterDocument {
  salary: string;
  joiningDate: string;
  offerValidity: string;
}

const OfferLetterSchema: Schema<OfferLetterDocument> = new Schema({
  salary: { type: String, required: true },
  joiningDate: { type: String, required: true },
  offerValidity: { type: String, required: true },
});

const OfferLetter = BaseLetter.discriminator<OfferLetterDocument>(
  "offer",
  OfferLetterSchema,
);

/**
 * Appointment Letter
 */
export interface AppointmentLetterDocument extends BaseLetterDocument {
  appointmentDate: string;
  reportingTime: string;
  additionalNote?: string;
}

const AppointmentLetterSchema: Schema<AppointmentLetterDocument> = new Schema({
  appointmentDate: { type: String, required: true },
  reportingTime: { type: String, required: true },
  additionalNote: { type: String },
});

const AppointmentLetter = BaseLetter.discriminator<AppointmentLetterDocument>(
  "appointment",
  AppointmentLetterSchema,
);

export { BaseLetter, OfferLetter, AppointmentLetter };
