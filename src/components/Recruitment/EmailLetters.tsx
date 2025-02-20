"use client";
import React, { useState, ChangeEvent } from "react";
import { LetterText } from "lucide-react";
import { toast } from "react-toastify";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";

interface Candidate {
  candidateid: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  experience: string;
  linkedIn: string;
  notes: string;
  category: string;
}

const candidateData: Candidate[] = [
  {
    candidateid: 1,
    fullName: "Aarav Patel",
    email: "aarav.patel@example.com",
    phone: "+91 9876543210",
    address: "Mumbai, India",
    education: "B.Tech in Computer Science",
    experience: "3 years",
    linkedIn: "https://linkedin.com/in/aaravpatel",
    notes: "Full-stack  developer with 3 years of experience.",
    category: "Software Engineer",
  },
  {
    candidateid: 2,
    fullName: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+91 9123456789",
    address: "Bangalore, India",
    education: "B.Sc in Data Science",
    experience: "2 years",
    linkedIn: "https://linkedin.com/in/priyasharma",
    notes: "Skilled in data analysis and visualization.",
    category: "Data Scientist",
  },
  {
    candidateid: 3,
    fullName: "Rohan Mehta",
    email: "rohan.mehta@example.com",
    phone: "+91 9988776655",
    address: "Hyderabad, India",
    education: "Diploma in DevOps",
    experience: "4 years",
    linkedIn: "https://linkedin.com/in/rohanmehta",
    notes: "DevOps engineer with expertise in CI/CD pipelines.",
    category: "DevOps Engineer",
  },
];

type LetterType = "offer" | "appointment" | "";

interface LetterFormData {
  // Fields for offer letter
  salary?: string;
  joiningDate?: string;
  offerValidity?: string;
  // Fields for appointment letter
  appointmentDate?: string;
  reportingTime?: string;
  additionalNote?: string;
}

const EmailLetters: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  );
  const [selectedLetter, setSelectedLetter] = useState<LetterType>("");
  const [letterFormData, setLetterFormData] = useState<LetterFormData>({});
  const [loading, setLoading] = useState<boolean>(false);

  // Filter candidates based on search input
  const filteredCandidates = candidateData.filter((candidate) =>
    candidate.fullName.toLowerCase().includes(searchTerm.trim().toLowerCase()),
  );

  const handleCandidateSelect = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    // Clear any previously selected letter and its form data.
    setSelectedLetter("");
    setLetterFormData({});
  };

  const handleLetterFieldChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setLetterFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Simulate sending the letter via email.
  const sendEmail = (emailType: string) => {
    if (!selectedCandidate) {
      toast.error("Please select a candidate first.");
      return;
    }
    toast.success(
      `📩 ${emailType} sent to ${selectedCandidate.email} with details: ${JSON.stringify(
        letterFormData,
      )}`,
    );

    // Clear the form after sending.
    setSelectedLetter("");
    setLetterFormData({});
  };

  // When a letter button is clicked, open the form for that letter.
  const handleLetterClick = (type: LetterType) => {
    if (!selectedCandidate) {
      toast.error("Please select a candidate first.");
      return;
    }
    setSelectedLetter(type);
    // Optionally pre-populate default values for each letter type.
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <Breadcrumb pageName="Send Emails to Candidates" />

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search candidate by name..."
        className="mb-4 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Candidate List */}
      <ul className="overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
        {filteredCandidates.length === 0 ? (
          <li className="p-3 text-gray-500">No candidates found.</li>
        ) : (
          filteredCandidates.map((candidate) => (
            <li
              key={candidate.candidateid}
              className={`cursor-pointer p-3 ${
                selectedCandidate?.candidateid === candidate.candidateid
                  ? "bg-blue-100 font-semibold"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => handleCandidateSelect(candidate)}
            >
              {candidate.fullName} ({candidate.email})
            </li>
          ))
        )}
      </ul>

      {/* Letter Buttons */}
      <div className="mt-4 flex gap-4">
        <button
          className={`rounded-md px-4 py-2 ${
            selectedCandidate
              ? "bg-green-600 text-white hover:bg-green-700"
              : "cursor-not-allowed bg-gray-400"
          }`}
          onClick={() => handleLetterClick("offer")}
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
          onClick={() => handleLetterClick("appointment")}
          disabled={!selectedCandidate}
        >
          Send Appointment Letter
        </button>
      </div>

      {/* Letter Form (conditional rendering) */}
      {selectedLetter && (
        <div className="mt-6 rounded-md border p-4 shadow-md dark:border-gray-600 dark:bg-gray-800">
          <h2 className="mb-3 text-lg font-semibold text-black dark:text-white">
            {selectedLetter === "offer"
              ? "Offer Letter Details"
              : "Appointment Letter Details"}
          </h2>

          {selectedLetter === "offer" ? (
            <>
              <div className="mb-3">
                <label className="block text-sm font-medium text-black dark:text-white">
                  Salary
                </label>
                <input
                  type="text"
                  name="salary"
                  placeholder="Enter salary"
                  value={letterFormData.salary || ""}
                  onChange={handleLetterFieldChange}
                  className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-black dark:text-white">
                  Joining Date
                </label>
                <input
                  type="date"
                  name="joiningDate"
                  value={letterFormData.joiningDate || ""}
                  onChange={handleLetterFieldChange}
                  className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-black dark:text-white">
                  Offer Validity
                </label>
                <input
                  type="text"
                  name="offerValidity"
                  placeholder="e.g., 2 weeks"
                  value={letterFormData.offerValidity || ""}
                  onChange={handleLetterFieldChange}
                  className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </>
          ) : (
            <>
              <div className="mb-3">
                <label className="block text-sm font-medium text-black dark:text-white">
                  Appointment Date
                </label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={letterFormData.appointmentDate || ""}
                  onChange={handleLetterFieldChange}
                  className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-black dark:text-white">
                  Reporting Time
                </label>
                <input
                  type="time"
                  name="reportingTime"
                  value={letterFormData.reportingTime || ""}
                  onChange={handleLetterFieldChange}
                  className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-black dark:text-white">
                  Additional Note
                </label>
                <textarea
                  name="additionalNote"
                  placeholder="Any additional instructions..."
                  value={letterFormData.additionalNote || ""}
                  onChange={handleLetterFieldChange}
                  className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  rows={3}
                ></textarea>
              </div>
            </>
          )}

          <button
            onClick={() =>
              sendEmail(
                selectedLetter === "offer"
                  ? "Offer Letter"
                  : "Appointment Letter",
              )
            }
            className="mt-4 w-full rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
          >
            Send{" "}
            {selectedLetter === "offer" ? "Offer Letter" : "Appointment Letter"}
          </button>
        </div>
      )}

      {/* Message display */}
    </div>
  );
};

// Simulate sending email
async function sendEmail(emailType: string) {
  // Here you can add your API call logic.
  toast.success(`📩 ${emailType} sent successfully!`);
}

export default EmailLetters;
