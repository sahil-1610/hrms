"use client";
import React from "react";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { useRouter } from "next/navigation";

const candidates = [
  {
    candidateid: 1,
    fullName: "Aarav Patel",
    category: "Software Engineer",
    experience: "3 years",
  },
  {
    candidateid: 2,
    fullName: "Priya Sharma",
    category: "Data Scientist",
    experience: "2 years",
  },
  {
    candidateid: 3,
    fullName: "Rohan Mehta",
    category: "DevOps Engineer",
    experience: "4 years",
  },
];

function CandidateResponse() {
  const router = useRouter();

  return (
    <>
      <Breadcrumb pageName="Candidate Response" />
      <div className="relative overflow-x-auto p-6 shadow-md sm:rounded-lg">
        <h1 className="mb-4 text-2xl font-bold">Candidate List</h1>
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
          <thead className="text-xs uppercase text-gray-700 dark:text-gray-400">
            <tr>
              <th className="bg-gray-50 px-6 py-3 dark:bg-gray-800">
                Candidate Name
              </th>
              <th className="px-6 py-3">Category</th>
              <th className="bg-gray-50 px-6 py-3 dark:bg-gray-800">
                Experience
              </th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr
                key={candidate.candidateid}
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <th className="whitespace-nowrap bg-gray-50 px-6 py-4 font-medium text-gray-900 dark:bg-gray-800 dark:text-white">
                  {candidate.fullName}
                </th>
                <td className="px-6 py-4">{candidate.category}</td>
                <td className="bg-gray-50 px-6 py-4 dark:bg-gray-800">
                  {candidate.experience}
                </td>
                <td className="px-6 py-4">
                  <button
                    className="text-blue-600 underline hover:text-blue-800"
                    onClick={() =>
                      router.push(
                        `/recruitment/viewcandidates/${candidate.candidateid}`,
                      )
                    }
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default CandidateResponse;
