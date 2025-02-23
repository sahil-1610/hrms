import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Base interface and schema for letters.
 * Now only contains the discriminator key, isSent, and cloudinaryUrl.
 */
export interface BaseLetterDocument extends Document {
  letterType: "offer" | "appointment";
  isSent: boolean;
  cloudinaryUrl?: string;
  markAsSent?: (url: string) => Promise<BaseLetterDocument>;
}

const BaseLetterSchema: Schema<BaseLetterDocument> = new Schema(
  {
    letterType: {
      type: String,
      enum: ["offer", "appointment"],
      required: true,
    },
    isSent: { type: Boolean, default: false },
    cloudinaryUrl: { type: String },
  },
  { discriminatorKey: "letterType", timestamps: true },
);

// Helper method to mark a letter as sent.
BaseLetterSchema.methods.markAsSent = async function (url: string) {
  this.cloudinaryUrl = url;
  this.isSent = true;
  return this.save();
};

// Create the base model (reuse if already defined)
const BaseLetter: Model<BaseLetterDocument> =
  mongoose.models.Letter ||
  mongoose.model<BaseLetterDocument>("Letter", BaseLetterSchema);

/**
 * Offer Letter
 * No additional fields are stored.
 */
export interface OfferLetterDocument extends BaseLetterDocument {}
const OfferLetterSchema: Schema<OfferLetterDocument> = new Schema({});

// Cache the discriminator globally to avoid re-compiling it during hot reloads
declare global {
  // eslint-disable-next-line no-var
  var OfferLetter: Model<OfferLetterDocument> | undefined;
}

const OfferLetter: Model<OfferLetterDocument> =
  global.OfferLetter || BaseLetter.discriminator("offer", OfferLetterSchema);
global.OfferLetter = OfferLetter;

/**
 * Appointment Letter
 * No additional fields are stored.
 */
export interface AppointmentLetterDocument extends BaseLetterDocument {}
const AppointmentLetterSchema: Schema<AppointmentLetterDocument> = new Schema(
  {},
);

declare global {
  // eslint-disable-next-line no-var
  var AppointmentLetter: Model<AppointmentLetterDocument> | undefined;
}

const AppointmentLetter: Model<AppointmentLetterDocument> =
  global.AppointmentLetter ||
  BaseLetter.discriminator("appointment", AppointmentLetterSchema);
global.AppointmentLetter = AppointmentLetter;

export { BaseLetter, OfferLetter, AppointmentLetter };
