"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

interface Vacancy {
  _id: string; // vacancy ID from MongoDB
  vacancyName: string;
  jobTitle: string;
  description: string;
  hiringManager: string;
  positions: number;
  isActive: boolean;
  url?: string;
  hiringManagerEmail: string;
}

const VacancyList: React.FC = () => {
  const router = useRouter();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  // Track which vacancy descriptions are expanded.
  const [expandedDescriptions, setExpandedDescriptions] = useState<{
    [key: string]: boolean;
  }>({});

  // Fetch vacancies on mount.
  useEffect(() => {
    fetchVacancies();
  }, []);

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

  // Toggle the expanded state for a vacancy's description.
  const toggleDescription = (vacancyId: string) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [vacancyId]: !prev[vacancyId],
    }));
  };

  // Update vacancy: redirect to the edit page.
  const handleUpdate = (vacancy: Vacancy) => {
    // Redirect to an edit page with vacancy ID in query string.
    router.push(`/recruitment/jobvacancy/edit?id=${vacancy._id}`);
  };

  // Delete vacancy.
  const handleDelete = async (vacancyId: string) => {
    if (!confirm("Are you sure you want to delete this vacancy?")) return;
    try {
      const res = await fetch("/api/recruitment/jobvacancy", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: vacancyId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete vacancy");
      }
      // Remove the vacancy from local state.
      setVacancies((prev) => prev.filter((v) => v._id !== vacancyId));
      alert("Vacancy deleted successfully");
    } catch (error: any) {
      console.error("Delete error:", error);
      alert(`Error deleting vacancy: ${error.message}`);
    }
  };

  // Helper to truncate text if not expanded.
  const renderDescription = (vacancy: Vacancy) => {
    const isExpanded = expandedDescriptions[vacancy._id];
    const fullText = vacancy.description;
    const truncated =
      fullText.length > 200 ? fullText.substring(0, 200) + "..." : fullText;
    return (
      <div className="relative rounded border border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {isExpanded ? fullText : truncated}
        </p>
        {fullText.length > 200 && (
          <button
            onClick={() => toggleDescription(vacancy._id)}
            className="mt-2 text-xs text-blue-600 hover:underline dark:text-blue-400"
          >
            {isExpanded ? "Show Less" : "Read More"}
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      <Breadcrumb pageName="Vacancy List" />

      <div className="mx-auto max-w-3xl gap-2 rounded-md bg-white p-6 shadow-md dark:bg-boxdark">
        <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
          Vacancy List
        </h2>

        {loading ? (
          <p>Loading vacancies...</p>
        ) : vacancies.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">
            No vacancies found.
          </p>
        ) : (
          vacancies.map((vacancy) => (
            <div
              key={vacancy._id}
              className="mb-4 rounded-lg border border-stroke bg-transparent p-4 dark:border-form-strokedark dark:bg-form-input"
            >
              <h3 className="text-lg font-medium text-black dark:text-white">
                {vacancy.vacancyName} ({vacancy.jobTitle})
              </h3>
              {renderDescription(vacancy)}
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <strong>Hiring Manager:</strong> {vacancy.hiringManager}
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <strong>Hiring Manager Email :</strong>{" "}
                {vacancy.hiringManagerEmail}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Positions:</strong> {vacancy.positions}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Active:</strong> {vacancy.isActive ? "Yes" : "No"}
              </p>
              {vacancy.url && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Apply Link:</strong>{" "}
                  <Link
                    href={vacancy.url}
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {vacancy.url}
                  </Link>
                </p>
              )}
              <div className="mx-3 my-2 flex gap-3">
                <button
                  onClick={() => handleUpdate(vacancy)}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-2 text-center font-medium text-white hover:bg-opacity-90"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(vacancy._id)}
                  className="inline-flex items-center justify-center rounded-full bg-red-600 px-8 py-2 text-center font-medium text-white hover:bg-opacity-90"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default VacancyList;
