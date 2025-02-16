"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { X } from "lucide-react";

interface CandidateData {
  applicationStatus: boolean;
  notes: string;
}
interface Candidate {
  _id: string; // Candidate document ID from MongoDB
  fullName: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  experience: string;
  linkedIn: string;
  notes: string;
  vacancyId: string | { _id: string; vacancyName: string; description: string };
  category: string;
  resume: string; // URL to the resume file
  candidateData?: CandidateData;
}

// A simple component to display the analysis result.
interface AnalysisResultCardProps {
  result: string;
  onClose: () => void;
}

const AnalysisResultCard: React.FC<AnalysisResultCardProps> = ({
  result,
  onClose,
}) => {
  return (
    <div className="mb-4 rounded-md border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold text-black dark:text-white">
          Resume Analysis
        </h3>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          <X size={20} />
        </button>
      </div>
      <textarea
        readOnly
        value={result}
        className="mt-2 w-full rounded-md border p-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        rows={3}
      ></textarea>
    </div>
  );
};

const CandidateOperation: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const candidateId = params?.candidateid; // Ensure your route is defined with [candidateid]
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [alignmentResult, setAlignmentResult] = useState<string>("");
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!candidateId) return;
    const fetchCandidate = async () => {
      setLoading(true);
      try {
        // Pass candidateId as a query parameter.
        const res = await fetch(
          `/api/recruitment/candidateresponse?candidateId=${candidateId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
        );
        const data = await res.json();
        if (res.ok && data.success) {
          // If API returns an array, pick the first candidate.
          const fetchedCandidate = Array.isArray(data.data)
            ? data.data[0]
            : data.data;
          setCandidate(fetchedCandidate);
        } else {
          setMessage(data.message || "Candidate not found");
        }
      } catch (error) {
        console.error("Fetch candidate error:", error);
        setMessage("Error fetching candidate details");
      } finally {
        setLoading(false);
      }
    };
    fetchCandidate();
  }, [candidateId]);

  // Function to analyze the resume using your backend API.
  const handleAnalyzeResume = async () => {
    if (!candidate) return;
    setLoading(true);
    setAlignmentResult("");
    setMessage("");
    try {
      // Use the vacancy description from the populated vacancy field.
      const vacancyDescription =
        typeof candidate.vacancyId === "object"
          ? candidate.vacancyId.description
          : "";
      console.log("Vacancy Description:", vacancyDescription);

      const res = await fetch("/api/recruitment/compare-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeUrl: candidate.resume,
          vacancyDescription,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to analyze resume");
      }
      setAlignmentResult(data.alignmentScore);
      setShowAnalysis(true);
    } catch (error: any) {
      console.error("Error analyzing resume:", error);
      setMessage("Error analyzing resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to simulate sending a decision (accept/reject).
  const handleDecision = async (decision: { decision: string }) => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/candidateDecision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateid: candidate?._id,
          fullName: candidate?.fullName,
          email: candidate?.email,
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


  if (!candidate) {
    return <div className="p-6 text-primary-500">Loading Candidate Details</div>;
  }
  return (
    <div className="p-6">
      <Breadcrumb pageName="Candidate Operation" />
      {showAnalysis && alignmentResult && (
        <AnalysisResultCard
          result={alignmentResult}
          onClose={() => setShowAnalysis(false)}
        />
      )}
      <div className="mx-auto max-w-3xl rounded-md bg-white p-6 shadow-md dark:bg-gray-800">
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
          <strong>Notes:</strong>{" "}
          {candidate.candidateData?.notes || "No additional notes"}
        </p>
        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
          <strong>Resume:</strong>{" "}
          <a
            href={candidate.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline dark:text-blue-400"
          >
            Download
          </a>
        </p>
        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
          <strong>Vacancy Applied For:</strong>{" "}
          {typeof candidate.vacancyId === "object"
            ? candidate.vacancyId.vacancyName
            : candidate.vacancyId || "Not provided"}
        </p>

        <div className="mt-6">
          <button
            onClick={handleAnalyzeResume}
            className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </div>

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
          <p className="mt-4 text-sm text-gray-700 dark:text-red-300">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default CandidateOperation;
