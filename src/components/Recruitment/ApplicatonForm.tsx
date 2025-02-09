"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useSearchParams } from "next/navigation";

interface ApplyForVacancyProps {
  vacancyid: string;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  experience: string;
  linkedIn: string;
  resume: File | null;
  notes: string;
}

export default function ApplyForVacancy({
  vacancyid,
}: ApplyForVacancyProps): JSX.Element {
  // Get query parameters using useSearchParams hook
  const searchParams = useSearchParams();
  const jobName = searchParams.get("jobName") || "Job Vacancy";

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    education: "",
    experience: "",
    linkedIn: "",
    resume: null,
    notes: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setFormData((prev) => ({ ...prev, resume: files[0] }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Submitted", formData);
    // Add your submit logic here.
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-bold text-black dark:text-white">
        Apply for {jobName}
      </h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-black dark:text-white">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full rounded border p-2 text-black dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-black dark:text-white">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded border p-2 text-black dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-black dark:text-white">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded border p-2 text-black dark:bg-gray-700 dark:text-white"
          />
        </div>
        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-black dark:text-white">
            Address
          </label>
          <input
            type="text"
            name="address"
            placeholder="Your Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full rounded border p-2 text-black dark:bg-gray-700 dark:text-white"
          />
        </div>
        {/* Education */}
        <div>
          <label className="block text-sm font-medium text-black dark:text-white">
            Education
          </label>
          <input
            type="text"
            name="education"
            placeholder="Highest Qualification"
            value={formData.education}
            onChange={handleChange}
            className="w-full rounded border p-2 text-black dark:bg-gray-700 dark:text-white"
          />
        </div>
        {/* Work Experience */}
        <div>
          <label className="block text-sm font-medium text-black dark:text-white">
            Work Experience
          </label>
          <input
            type="text"
            name="experience"
            placeholder="e.g., 2 years, Internships, etc."
            value={formData.experience}
            onChange={handleChange}
            className="w-full rounded border p-2 text-black dark:bg-gray-700 dark:text-white"
          />
        </div>
        {/* LinkedIn Profile */}
        <div>
          <label className="block text-sm font-medium text-black dark:text-white">
            LinkedIn Profile
          </label>
          <input
            type="url"
            name="linkedIn"
            placeholder="Your LinkedIn URL"
            value={formData.linkedIn}
            onChange={handleChange}
            className="w-full rounded border p-2 text-black dark:bg-gray-700 dark:text-white"
          />
        </div>
        {/* Resume Upload */}
        <div>
          <label className="block font-medium text-black dark:text-white">
            Resume*
          </label>
          <input
            type="file"
            name="resume"
            accept=".docx,.doc,.odt,.pdf,.rtf,.txt"
            onChange={handleFileChange}
            className="w-full rounded border p-2 text-black dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-black dark:text-white">
            Additional Notes
          </label>
          <textarea
            name="notes"
            placeholder="Any additional information..."
            value={formData.notes}
            onChange={handleChange}
            className="w-full rounded border p-2 text-black dark:bg-gray-700 dark:text-white"
            rows={3}
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full rounded bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}
