// models/Person.ts (snippet update)
export interface EmailHistoryEntry {
  emailId: string;
  subject: string;
  body: string;
  sentDate: Date;
  direction: "sent" | "received"; // optionally indicate if the email was sent or received
}

export interface PersonDocument extends Document {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  experience: string;
  linkedIn: string;
  role: "candidate" | "employee";
  status: "active" | "inactive";
  resume?: string;
  candidateData?: {
    applicationStatus: boolean;
    notes: string;
  };
  employeeData?: {
    department: string;
    hireDate: Date;
    performanceScore: string;
  };
  emailHistory?: EmailHistoryEntry[]; // Embedded email history array
}

const PersonSchema: Schema<PersonDocument> = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    education: { type: String, required: true },
    experience: { type: String, required: true },
    linkedIn: { type: String, required: false },
    role: { type: String, enum: ["candidate", "employee"], required: true },
    status: { type: String, enum: ["active", "inactive"], required: true },
    resume: { type: String },
    candidateData: {
      applicationStatus: { type: Boolean },
      notes: { type: String },
    },
    employeeData: {
      department: { type: String },
      hireDate: { type: Date },
      performanceScore: { type: String },
    },
    emailHistory: [
      {
        emailId: { type: String },
        subject: { type: String },
        body: { type: String },
        sentDate: { type: Date },
        direction: { type: String, enum: ["sent", "received"] },
      },
    ],
  },
  { timestamps: true },
);
