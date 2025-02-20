"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

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
  vacancyId: string | { _id: string; vacancyName: string };
}

const CandidateResponse: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/recruitment/candidateresponse", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCandidates(data.data);
      } else {
        console.error("Error fetching candidates:", data.message);
      }
    } catch (error) {
      console.error("Fetch candidates error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Breadcrumb pageName="Candidate Response" />
      <h1 className="mb-4 text-center text-2xl font-bold text-black dark:text-white">
        Candidate List
      </h1>
      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          Loading candidates...
        </p>
      ) : candidates.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          No candidate applications found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">Candidate Name</th>
                <th className="px-6 py-3">Vacancy Name</th>
                <th className="px-6 py-3">Experience</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr
                  key={candidate._id}
                  className="border-b border-gray-200 dark:border-gray-700"
                >
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {candidate.fullName}
                  </td>
                  <td className="px-6 py-4">
                    {typeof candidate.vacancyId === "object"
                      ? candidate.vacancyId.vacancyName || "Not provided"
                      : candidate.vacancyId || "Not provided"}
                  </td>
                  <td className="bg-gray-50 px-6 py-4 dark:bg-gray-800">
                    {candidate.experience}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        console.log(
                          "Redirecting candidate with id:",
                          candidate._id,
                        );
                        router.push(
                          `/recruitment/viewcandidates/${candidate._id}`,
                        );
                      }}
                      className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CandidateResponse;
