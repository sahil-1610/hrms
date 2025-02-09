"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

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

const candidates: Candidate[] = [
  {
    candidateid: 1,
    fullName: "Aarav Patel",
    email: "aarav@example.com",
    phone: "+91 9876543210",
    address: "Mumbai, India",
    education: "B.Tech in Computer Science",
    experience: "3 years",
    linkedIn: "https://linkedin.com/in/aaravpatel",
    notes: "Passionate about technology and innovation.",
    category: "Software Engineer",
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
  },
  {
    candidateid: 3,
    fullName: "Rohan Mehta",
    email: "rohan@example.com",
    phone: "+91 9988776655",
    address: "Hyderabad, India",
    education: "Diploma in DevOps",
    experience: "4 years",
    linkedIn: "https://linkedin.com/in/rohanmehta",
    notes: "Expert in cloud infrastructure and automation.",
    category: "DevOps Engineer",
  },
];

const CandidateResponse: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <Breadcrumb pageName="Candidate Response" />
      <div className="relative overflow-x-auto p-6 shadow-md sm:rounded-lg">
        <h1 className="mb-4 text-2xl font-bold text-black dark:text-white">
          Candidate List
        </h1>
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
};

export default CandidateResponse;
