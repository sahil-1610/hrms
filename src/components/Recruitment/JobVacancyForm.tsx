"use client";

import React, { useState, FormEvent } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { chatWithAI } from "@/helpers/geminiAIModel";
import SwitcherThree from "@/components/Switchers/SwitcherThree";

interface VacancyFormData {
  vacancyName: string;
  jobTitle: string;
  description: string;
  positions: number;
  isActive: boolean;
  hiringManager: string;
}

const VacancyForm: React.FC = () => {
  const [vacancyForm, setVacancyForm] = useState<VacancyFormData>({
    vacancyName: "",
    jobTitle: "",
    description: "",
    positions: 0,
    isActive: true,
    hiringManager: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    field: keyof VacancyFormData,
    value: string | number | boolean,
  ) => {
    setVacancyForm((prev) => ({ ...prev, [field]: value }));
  };

  const formatJobDescription = (text: string) => {
    return text.trim();
  };

  const generateDescription = async () => {
    if (!vacancyForm.jobTitle) {
      alert("Please enter a job title before generating a description.");
      return;
    }
    setLoading(true);
    try {
      const prompt = `Generate a well-structured job description for the position of ${vacancyForm.jobTitle}. Include sections for Responsibilities, Qualifications, and Benefits with properly formatted bullet points.`;
      const generatedText = await chatWithAI(prompt);
      const formattedText = formatJobDescription(generatedText);
      setVacancyForm((prev) => ({ ...prev, description: formattedText }));
    } catch (error) {
      console.error("Error generating job description:", error);
      alert("Failed to generate job description. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        vacancyName: vacancyForm.vacancyName,
        jobTitle: vacancyForm.jobTitle,
        description: vacancyForm.description,
        positions: vacancyForm.positions,
        isActive: vacancyForm.isActive,
        hiringManager: vacancyForm.hiringManager,
      };
      console.log(vacancyForm);
      const res = await fetch("/api/recruitment/jobvacancy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create vacancy");
      }
      console.log("Vacancy created successfully:", data.data);
      alert("Vacancy created successfully");
      // Optionally reset the form after creation.
      setVacancyForm({
        vacancyName: "",
        jobTitle: "",
        description: "",
        positions: 0,
        isActive: true,
        hiringManager: "",
      });
    } catch (error: any) {
      console.error("Vacancy submission error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl rounded-md bg-white p-6 shadow-md dark:bg-boxdark">
      <Breadcrumb pageName="Vacancy Form" />
      <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
        Create Vacancy
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Vacancy Name */}
        <div>
          <label className="block text-sm font-medium text-black dark:text-white">
            Vacancy Name
          </label>
          <input
            type="text"
            name="vacancyName"
            placeholder="Enter vacancy name"
            value={vacancyForm.vacancyName}
            onChange={(e) => handleChange("vacancyName", e.target.value)}
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
            required
          />
        </div>

        {/* Job Title */}
        <div>
          <label className="block text-sm font-medium text-black dark:text-white">
            Job Title
          </label>
          <input
            type="text"
            name="jobTitle"
            placeholder="Enter job title"
            value={vacancyForm.jobTitle}
            onChange={(e) => handleChange("jobTitle", e.target.value)}
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-black dark:text-white">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            placeholder="Enter job description"
            value={vacancyForm.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
            required
          ></textarea>
          <button
            type="button"
            onClick={generateDescription}
            disabled={loading}
            className="mt-2 rounded bg-gray-200 px-3 py-1 text-xs font-medium text-black hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            {loading
              ? "Generating..."
              : vacancyForm.description
                ? "Generate Other"
                : "Generate Job Description"}
          </button>
        </div>

        {/* Hiring Manager */}
        <div>
          <label className="block text-sm font-medium text-black dark:text-white">
            Hiring Manager Name
          </label>
          <input
            type="text"
            name="hiringManager"
            placeholder="Enter hiring manager name"
            value={vacancyForm.hiringManager}
            onChange={(e) => handleChange("hiringManager", e.target.value)}
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
            required
          />
        </div>

        {/* Number of Positions */}
        <div>
          <label className="block text-sm font-medium text-black dark:text-white">
            Number of Positions
          </label>
          <input
            type="number"
            name="positions"
            placeholder="Enter number of positions"
            value={vacancyForm.positions}
            onChange={(e) => handleChange("positions", Number(e.target.value))}
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
            required
          />
        </div>

        {/* Is Active */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-black dark:text-white">
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
            className="w-full rounded-md bg-primary px-4 py-2 text-white transition hover:bg-opacity-80"
          >
            {loading ? "Submitting..." : "Create Vacancy"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VacancyForm;
