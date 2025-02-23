// app/api/admin/generate-letter/route.ts
import { NextRequest, NextResponse } from "next/server";
import { OfferLetter, AppointmentLetter } from "@/models/Letter.model";
import Person from "@/models/Person.model";
import dbConnect from "@/lib/dbConnect";
import { uploadPDF } from "@/utils/cloudinary"; // reusing your Cloudinary PDF upload helper
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  // Connect to the database
  await dbConnect();

  // Use Next.js built‑in formData() to extract fields and file.
  const formData = await req.formData();
  const employeeId = formData.get("employeeId") as string;
  const letterType = formData.get("letterType") as string;
  const file = formData.get("file") as File;

  // Validate required fields.
  if (
    !employeeId ||
    !letterType ||
    (letterType !== "offer" && letterType !== "appointment")
  ) {
    return NextResponse.json(
      { message: "Invalid parameters" },
      { status: 400 },
    );
  }
  if (!file) {
    return NextResponse.json({ message: "File not provided" }, { status: 400 });
  }

  // Upload the PDF file to Cloudinary using your helper function.
  let uploadResult;
  try {
    uploadResult = await uploadPDF(file);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error uploading file", error: error.message },
      { status: 500 },
    );
  }
  const cloudinaryUrl = uploadResult.url;

  // Find the employee in the database.
  const employee = await Person.findById(employeeId);
  if (!employee) {
    return NextResponse.json(
      { message: "Employee not found" },
      { status: 404 },
    );
  }

  // Check if a letter of the given type already exists for the employee.
  let letterDoc: any = null;
  if (employee.letters && employee.letters.length > 0) {
    await employee.populate("letters");
    letterDoc = employee.letters.find(
      (letter: any) => letter.letterType === letterType,
    );
  }

  // If no such letter exists, create one and add its reference to the employee.
  if (!letterDoc) {
    if (letterType === "offer") {
      letterDoc = await OfferLetter.create({ isSent: false });
    } else {
      letterDoc = await AppointmentLetter.create({ isSent: false });
    }
    if (!employee.letters) employee.letters = [];
    employee.letters.push(letterDoc._id);
    await employee.save();
  }

  // NEW: If the letter document is already marked as sent, return a response indicating that.
  if (letterDoc.isSent === true) {
    return NextResponse.json(
      { message: "Letter has already been sent." },
      { status: 400 },
    );
  }

  // Update the letter document: attach the Cloudinary URL and mark it as sent.
  letterDoc.cloudinaryUrl = cloudinaryUrl;
  letterDoc.isSent = true;
  await letterDoc.save();

  // Prepare email details.
  const subject =
    letterType === "offer" ? "Offer Letter" : "Appointment Letter";
  const text = `Dear ${employee.fullName},\n\nPlease find your ${letterType} letter attached.\n\nBest regards,\nHR Team`;
  const html = `<p>Dear ${employee.fullName},</p>
                <p>Please find your ${letterType} letter attached.</p>
                <p>Best regards,<br/>HR Team</p>`;

  // Send the email using your sendEmail helper.
  try {
    await sendEmail({
      to: employee.email,
      subject,
      text,
      html,
      from: process.env.SMTP_FROM,
      // Attach the file using the Cloudinary URL.
      attachments: [
        {
          filename: `${letterType}-letter.pdf`,
          path: cloudinaryUrl,
        },
      ],
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error sending email", error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    message:
      "Letter generated, uploaded to Cloudinary, updated in DB, and emailed successfully.",
  });
}
