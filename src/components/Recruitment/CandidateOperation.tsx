"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  resume: string; // URL or path to the resume file
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
    notes: "Full-stack developer with 3 years of experience.",
    category: "Software Engineer",
    resume: "/resumes/aarav_patel_resume.pdf",
  },
  {
    candidateid: 2,
    fullName: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91 9123456789",
    address: "Bangalore, India",
    education: "B.Sc in Data Science",
    experience: "2 years",
    linkedIn: "https://linkedin.com/in/priyasharma",
    notes: "Skilled in data analysis and visualization.",
    category: "Data Scientist",
    resume: "/resumes/priya_sharma_cv.pdf",
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
    resume: "/resumes/rohan_mehta_resume.pdf",
  },
];

const CandidateOperation: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const candidate = candidateData.find(
    (c) => c.candidateid === Number(params.candidateid),
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [alignmentResult, setAlignmentResult] = useState<string>("");

  if (!candidate) {
    return <div className="text-red-500">Candidate not found!</div>;
  }

  // Function to simulate sending the resume text (extracted from the resume URL)
  // along with a job description to the Gemini API for analysis.
  const handleAnalyzeResume = async () => {
    setLoading(true);
    setAlignmentResult("");
    setMessage("");

    try {
      // For demonstration, we'll simulate an API call with a timeout.
      // In your real implementation, you might:
      // 1. Call an API route that fetches the resume file from candidate.resume,
      //    extracts its text, then sends it along with the job description to Gemini.
      // 2. Receive a response with a score or detailed analysis.
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulated response – replace with actual Gemini API response.
      const simulatedResponse =
        "The resume is 85% aligned with the job description based on the required skills and experience.";

      setAlignmentResult(simulatedResponse);
    } catch (error) {
      setMessage("Error analyzing resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (decision: { decision: string }) => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/candidateDecision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateid: candidate.candidateid,
          fullName: candidate.fullName,
          email: candidate.email,
          decision,
        }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Candidate Operation" />
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-bold text-black dark:text-white">
          {candidate.fullName}
        </h1>
        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
          <strong>Email:</strong> {candidate.email}
        </p>
        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
          <strong>Phone:</strong> {candidate.phone}
        </p>
        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
          <strong>Address:</strong> {candidate.address}
        </p>
        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
          <strong>Education:</strong> {candidate.education}
        </p>
        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
          <strong>Experience:</strong> {candidate.experience}
        </p>
        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
          <strong>Category:</strong> {candidate.category}
        </p>
        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
          <strong>LinkedIn:</strong>{" "}
          <a
            href={candidate.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline dark:text-blue-400"
          >
            {candidate.linkedIn}
          </a>
        </p>
        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
          <strong>Notes:</strong> {candidate.notes}
        </p>
        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
          <strong>Resume:</strong>{" "}
          <a
            href={`/${candidate.resume}`}
            className="text-blue-600 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download
          </a>
        </p>

        {/* Analyze Resume Button & Result */}
        <div className="mt-6">
          <button
            onClick={handleAnalyzeResume}
            className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
          {alignmentResult && (
            <textarea
              readOnly
              value={alignmentResult}
              className="mt-4 w-full rounded-md border p-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              rows={3}
            ></textarea>
          )}
        </div>

        {/* Accept & Reject Buttons */}
        <div className="mt-4 flex gap-4">
          <button
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:bg-gray-400"
            onClick={() => handleDecision({ decision: "accepted" })}
            disabled={loading}
          >
            Accept
          </button>
          <button
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:bg-gray-400"
            onClick={() => handleDecision({ decision: "rejected" })}
            disabled={loading}
          >
            Reject
          </button>
        </div>

        {message && (
          <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
            {message}
          </p>
        )}
      </div>
    </>
  );
};

export default CandidateOperation;
