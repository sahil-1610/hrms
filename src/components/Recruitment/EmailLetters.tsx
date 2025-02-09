"use client";
import React, { useState } from "react";
import { LetterText } from "lucide-react";
import { toast } from "react-toastify";

// Define Type for Candidates
type Candidate = {
  candidateid: number;
  fullName: string;
  email: string;
};

// Sample Candidate Data
const candidateData: Candidate[] = [
  { candidateid: 1, fullName: "Aarav Patel", email: "aarav.patel@example.com" },
  {
    candidateid: 2,
    fullName: "Priya Sharma",
    email: "priya.sharma@example.com",
  },
  { candidateid: 3, fullName: "Rohan Mehta", email: "rohan.mehta@example.com" },
];

function EmailLetters() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  );

  // Filter candidates based on search input
  const filteredCandidates = candidateData.filter((candidate) =>
    candidate.fullName.toLowerCase().includes(searchTerm.trim().toLowerCase()),
  );

  // Simulate sending an email
  const sendEmail = (emailType: string) => {
    if (!selectedCandidate) {
      toast.error("Please select a candidate first.");
      return;
    }
    toast.success(`📩 ${emailType} sent to ${selectedCandidate.email}`);
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 flex items-center text-2xl font-bold">
        <LetterText className="mr-2" />
        Send Emails to Candidates
      </h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search candidate by name..."
        className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Candidate List */}
      <ul className="overflow-hidden rounded-md border border-gray-200">
        {filteredCandidates.length === 0 ? (
          <li className="p-3 text-gray-500">No candidates found.</li>
        ) : (
          filteredCandidates.map((candidate) => (
            <li
              key={candidate.candidateid}
              className={`cursor-pointer p-3 ${
                selectedCandidate?.candidateid === candidate.candidateid
                  ? "bg-blue-100 font-semibold"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedCandidate(candidate)}
            >
              {candidate.fullName} ({candidate.email})
            </li>
          ))
        )}
      </ul>

      {/* Email Buttons */}
      <div className="mt-4 flex gap-4">
        <button
          className={`rounded-md px-4 py-2 ${
            selectedCandidate
              ? "bg-green-600 text-white hover:bg-green-700"
              : "cursor-not-allowed bg-gray-400"
          }`}
          onClick={() => sendEmail("Offer Letter")}
          disabled={!selectedCandidate}
        >
          Send Offer Letter
        </button>

        <button
          className={`rounded-md px-4 py-2 ${
            selectedCandidate
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "cursor-not-allowed bg-gray-400"
          }`}
          onClick={() => sendEmail("Appointment Letter")}
          disabled={!selectedCandidate}
        >
          Send Appointment Letter
        </button>
      </div>
    </div>
  );
}

export default EmailLetters;
