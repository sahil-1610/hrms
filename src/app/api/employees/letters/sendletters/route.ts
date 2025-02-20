// /app/api/letters/sendLetter/route.ts
import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Person from "@/models/Person.model";
import { OfferLetter, AppointmentLetter } from "@/models/Letter.model"; // Discriminator models
import { jwtVerify } from "jose";

// Authorization helper.
async function authorize(req: NextRequest): Promise<boolean> {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return false;
    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    await jwtVerify(token, secret);
    return true;
  } catch (error) {
    console.error("Authorization failed:", error);
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!(await authorize(req))) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    await dbConnect();
    // Parse the JSON body from the request
    const { employeeId, letterType, formData } = await req.json();

    // Validate the basic fields
    if (!employeeId || !letterType || !formData) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate letterType: should be either "offer" or "appointment"
    if (!["offer", "appointment"].includes(letterType)) {
      return NextResponse.json(
        { success: false, message: "Invalid letter type" },
        { status: 400 },
      );
    }

    // Find the employee
    const employee = (await Person.findById(employeeId)) as
      | typeof Person.prototype
      | null;
    if (!employee) {
      return NextResponse.json(
        { success: false, message: "Employee not found" },
        { status: 404 },
      );
    }

    // Create the appropriate letter based on the letterType
    // Define newLetter with a union type that covers both letter documents.
    let newLetter:
      | (typeof OfferLetter.prototype | typeof AppointmentLetter.prototype)
      | undefined;

    // Create the appropriate letter based on the letterType
    if (letterType === "offer") {
      if (!formData.salary || !formData.joiningDate) {
        return NextResponse.json(
          { success: false, message: "Missing offer letter required fields" },
          { status: 400 },
        );
      }
      newLetter = await OfferLetter.create({
        recipient: employeeId,
        salary: formData.salary,
        joiningDate: formData.joiningDate,
        offerValidity: formData.offerValidity || "",
        isSent: true,
        sentDate: new Date(),
      });
    } else if (letterType === "appointment") {
      if (!formData.appointmentDate || !formData.reportingTime) {
        return NextResponse.json(
          {
            success: false,
            message: "Missing appointment letter required fields",
          },
          { status: 400 },
        );
      }
      newLetter = await AppointmentLetter.create({
        recipient: employeeId,
        appointmentDate: formData.appointmentDate,
        reportingTime: formData.reportingTime,
        additionalNote: formData.additionalNote || "",
        isSent: true,
        sentDate: new Date(),
      });
    }

    // Ensure newLetter is defined before proceeding.
    if (!newLetter) {
      return NextResponse.json(
        { success: false, message: "Letter creation failed" },
        { status: 500 },
      );
    }

    // Update the employee document to include the new letter reference.
    employee.letters.push(newLetter._id);
    await employee.save();

    return NextResponse.json(
      { success: true, data: newLetter },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error sending letter:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
