// lib/updateCandidateStatus.ts
import Person from "@/models/Person.model";
import {
  BaseLetter,
  OfferLetter,
  AppointmentLetter,
} from "@/models/Letter.model";
import mongoose from "mongoose";

/**
 * Updates a candidate's status based on the decision.
 *
 * @param candidateId - The MongoDB _id of the candidate.
 * @param decision - "accepted" or "rejected".
 * @returns The updated candidate document.
 */
export async function updateCandidateStatus(
  candidateId: string,
  decision: "accepted" | "rejected",
) {
  if (decision === "accepted") {
    // For accepted candidates, update the role to "employee" and mark applicationStatus as true.
    const updatedCandidate = await Person.findByIdAndUpdate(
      candidateId,
      {
        role: "employee",
        "candidateData.applicationStatus": true,
      },
      { new: true, runValidators: true },
    );

    if (updatedCandidate) {
      // If no letters exist for this candidate, create both an offer and appointment letter.
      if (!updatedCandidate.letters || updatedCandidate.letters.length === 0) {
        // Create a new offer letter with isSent set to false.
        const newOfferLetter = await OfferLetter.create({ isSent: false });
        console.log("Created new offer letter:", newOfferLetter);

        // Create a new appointment letter with isSent set to false.
        const newAppointmentLetter = await AppointmentLetter.create({
          isSent: false,
        });
        console.log("Created new appointment letter:", newAppointmentLetter);

        // Ensure letters is defined
        if (!updatedCandidate.letters) {
          updatedCandidate.letters = [];
        }

        // Cast the _id fields explicitly to mongoose.Types.ObjectId
        updatedCandidate.letters.push(
          newOfferLetter._id as mongoose.Types.ObjectId,
          newAppointmentLetter._id as mongoose.Types.ObjectId,
        );
        await updatedCandidate.save();
        console.log("Updated candidate with new letters:", updatedCandidate);
      } else {
        // If letters already exist, update them to have isSent: false.
        await BaseLetter.updateMany(
          { _id: { $in: updatedCandidate.letters } },
          { isSent: false },
        );
      }
      return updatedCandidate;
    }
  } else if (decision === "rejected") {
    // For rejected candidates, delete the candidate.
    const deletedCandidate = await Person.findByIdAndDelete(candidateId);
    return deletedCandidate;
  } else {
    throw new Error("Invalid decision value.");
  }
}
