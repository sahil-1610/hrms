// lib/updateCandidateStatus.ts
import Person from "@/models/Person.model";

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
    return updatedCandidate;
  } else if (decision === "rejected") {
    // For rejected candidates, delete the candidate.
    const deletedCandidate = await Person.findByIdAndDelete(candidateId);
    return deletedCandidate;
  } else {
    throw new Error("Invalid decision value.");
  }
}
