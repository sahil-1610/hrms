"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Vacancy {
  id: number;
  vacancyName: string;
  jobTitle: string;
  description: string;
  hiringManager: string;
  positions: number;
  isActive: boolean;
  url?: string; // Optional if computed later
}

export default function RecruitmentList(): JSX.Element {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);

  useEffect(() => {
    // Simulated API fetch – replace with your actual API call.
    setVacancies([
      {
        id: 1,
        vacancyName: "Software Engineer",
        jobTitle: "Frontend Developer",
        description:
          "Develop and maintain web applications using React.js. Collaborate with the design team and ensure responsive design principles are followed.",
        hiringManager: "John Doe",
        positions: 3,
        isActive: true,
      },
      {
        id: 2,
        vacancyName: "Backend Engineer",
        jobTitle: "Node.js Developer",
        description:
          "Build and manage backend services using Node.js and Express. Ensure robust API development and smooth integration with frontend components.",
        hiringManager: "Jane Smith",
        positions: 2,
        isActive: false,
      },
    ]);
  }, []);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-center text-2xl font-bold text-black dark:text-white">
        Recent Recruitments
      </h1>
      <div className="space-y-4">
        {vacancies.map((vacancy) => (
          <div
            key={vacancy.id}
            className="cursor-pointer rounded-lg border p-4 shadow transition-all hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <h2 className="text-lg font-semibold text-black dark:text-white">
              {vacancy.vacancyName} ({vacancy.jobTitle})
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {vacancy.description}
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              <strong>Hiring Manager:</strong> {vacancy.hiringManager}
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              <strong>Positions:</strong> {vacancy.positions}
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              <strong>Active:</strong> {vacancy.isActive ? "Yes" : "No"}
            </p>
            <div className="mt-3 flex gap-3">
              <Link
                href={`/recruitment/jobapply/${vacancy.id}?jobName=${encodeURIComponent(vacancy.vacancyName)}`}
                className="inline-flex items-center justify-center rounded-full bg-meta-3 px-8 py-2 text-center font-medium text-white hover:bg-opacity-90"
              >
                Apply Link
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
