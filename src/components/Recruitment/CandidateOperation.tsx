"use client";
import React, { useState } from "react";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { useParams } from "next/navigation";


const candidateData = [
  {
    candidateid: 1,
    fullName: "Aarav Patel",
    email: "aarav.patel@example.com",
    contactNumber: "+91 9876543210",
    resume: "aarav_patel_resume.pdf",
    keywords: "React, Node.js, MongoDB",
    notes: "Full-stack developer with 3 years of experience.",
  },
  {
    candidateid: 2,
    fullName: "Priya Sharma",
    email: "priya.sharma@example.com",
    contactNumber: "+91 9123456789",
    resume: "priya_sharma_cv.pdf",
    keywords: "Machine Learning, Python, NLP",
    notes: "AI enthusiast passionate about deep learning.",
  },
  {
    candidateid: 3,
    fullName: "Rohan Mehta",
    email: "rohan.mehta@example.com",
    contactNumber: "+91 9988776655",
    resume: "rohan_mehta_resume.pdf",
    keywords: "DevOps, AWS, Docker",
    notes: "DevOps engineer with expertise in CI/CD pipelines.",
  },
];

function CandidateOperation() {
  const params = useParams();
  const candidate = candidateData.find(
    (c) => c.candidateid === Number(params.candidateid),
  );

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!candidate) {
    return <div className="text-red-500">Candidate not found!</div>;
  }

  const handleDecision = async (decision: {decision:string}) => {
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
        <h1 className="text-2xl font-bold">{candidate.fullName}</h1>
        <p>Email: {candidate.email}</p>
        <p>Contact: {candidate.contactNumber}</p>
        <p>
          Resume:{" "}
          <a href={`/${candidate.resume}`} className="text-blue-600 underline">
            Download
          </a>
        </p>
        <p>Keywords: {candidate.keywords}</p>
        <p>Notes: {candidate.notes}</p>

        {/* Accept & Reject Buttons */}
        <div className="mt-4 flex gap-4">
          <button
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:bg-gray-400"
            onClick={() => handleDecision("accepted")}
            disabled={loading}
          >
            Accept
          </button>
          <button
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:bg-gray-400"
            onClick={() => handleDecision("rejected")}
            disabled={loading}
          >
            Reject
          </button>
        </div>

        {message && <p className="mt-4 text-gray-700">{message}</p>}
      </div>
    </>
  );
}

export default CandidateOperation;
