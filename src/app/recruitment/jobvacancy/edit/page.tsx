"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SwitcherThree from "@/components/Switchers/SwitcherThree";

interface VacancyFormData {
  vacancyName: string;
  jobTitle: string;
  description: string;
  positions: number;
  isActive: boolean;
  hiringManager: string;
  hiringManagerEmail: string;
}

const VacancyEditPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const vacancyId = searchParams?.get("id") || "";
  const [vacancyForm, setVacancyForm] = useState<VacancyFormData>({
    vacancyName: "",
    jobTitle: "",
    description: "",
    positions: 0,
    isActive: true,
    hiringManager: "",
    hiringManagerEmail: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!vacancyId) return;
    const fetchVacancy = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/recruitment/jobvacancy`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          // Find the vacancy with the matching id
          const vacancy = data.data.find((v: any) => v._id === vacancyId);
          if (vacancy) {
            setVacancyForm({
              vacancyName: vacancy.vacancyName,
              jobTitle: vacancy.jobTitle,
              description: vacancy.description,
              positions: vacancy.positions,
              isActive: vacancy.isActive,
              hiringManager: vacancy.hiringManager,
              hiringManagerEmail: vacancy.hiringManagerEmail,
            });
          } else {
            alert("Vacancy not found");
          }
        } else {
          console.error("Error fetching vacancy:", data.message);
        }
      } catch (error) {
        console.error("Fetch vacancy error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVacancy();
  }, [vacancyId]);

  const handleChange = (
    field: keyof VacancyFormData,
    value: string | number | boolean,
  ) => {
    setVacancyForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        id: vacancyId,
        ...vacancyForm,
      };
      const res = await fetch("/api/recruitment/jobvacancy", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update vacancy");
      }
      alert("Vacancy updated successfully");
      router.push("/recruitment/jobvacancy");
    } catch (error: any) {
      console.error("Vacancy update error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-3xl p-6">
        <Breadcrumb pageName="Edit Vacancy" />
        <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
          Edit Vacancy
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Vacancy Name */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-gray-200">
              Vacancy Name
            </label>
            <input
              type="text"
              placeholder="Enter vacancy name"
              value={vacancyForm.vacancyName}
              onChange={(e) => handleChange("vacancyName", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black outline-none focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>
          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-gray-200">
              Job Title
            </label>
            <input
              type="text"
              placeholder="Enter job title"
              value={vacancyForm.jobTitle}
              onChange={(e) => handleChange("jobTitle", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black outline-none focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-gray-200">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Enter job description"
              value={vacancyForm.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black outline-none focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              required
            ></textarea>
          </div>
          {/* Hiring Manager */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-gray-200">
              Hiring Manager
            </label>
            <input
              type="text"
              placeholder="Enter hiring manager name"
              value={vacancyForm.hiringManager}
              onChange={(e) => handleChange("hiringManager", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black outline-none focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black dark:text-gray-200">
              Hiring Manager Email
            </label>
            <input
              type="text"
              placeholder="Enter hiring manager Email"
              value={vacancyForm.hiringManagerEmail}
              onChange={(e) =>
                handleChange("hiringManagerEmail", e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black outline-none focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>
          {/* Number of Positions */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-gray-200">
              Number of Positions
            </label>
            <input
              type="number"
              placeholder="Enter number of positions"
              min="1"
              value={vacancyForm.positions}
              onChange={(e) =>
                handleChange("positions", Number(e.target.value))
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-black outline-none focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>
          {/* Is Active */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-black dark:text-gray-200">
              Is Active
            </label>
            <SwitcherThree
              onChange={(value: boolean) => handleChange("isActive", value)}
            />
          </div>
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
            >
              {loading ? "Updating..." : "Update Vacancy"}
            </button>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default VacancyEditPage;
