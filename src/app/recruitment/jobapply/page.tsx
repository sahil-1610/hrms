"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

interface Vacancy {
  _id: string; // Vacancy ID from MongoDB
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
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchVacancies = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/recruitment/jobvacancy", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setVacancies(data.data);
        } else {
          console.error("Error fetching vacancies:", data.message);
        }
      } catch (error) {
        console.error("Fetch vacancies error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVacancies();
  }, []);

  return (
    <div className="p-6">
      <Breadcrumb pageName="Vacancy List" />
      <h1 className="mb-4 text-center text-2xl font-bold text-black dark:text-white">
        Recent Recruitments
      </h1>
      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          Loading vacancies...
        </p>
      ) : vacancies.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          No vacancies found.
        </p>
      ) : (
        <div className="space-y-4">
          {vacancies.map((vacancy) => (
            <div
              key={vacancy._id}
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
              {vacancy.url && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  <strong>Apply Link:</strong>{" "}
                  <Link
                    href={vacancy.url}
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {vacancy.url}
                  </Link>
                </p>
              )}
              <div className="mt-3 flex gap-3">
                <Link
                  href={`/recruitment/jobapply/${vacancy._id}?jobName=${encodeURIComponent(
                    vacancy.vacancyName,
                  )}`}
                  className="inline-flex items-center justify-center rounded-full bg-meta-3 px-8 py-2 text-center font-medium text-white hover:bg-opacity-90"
                >
                  Apply Link
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
