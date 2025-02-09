// /recruitment/[vacancyid].tsx
"use client";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ApplyForVacancy() {
  const params = useParams();
  const vacancyId = params.vacancyid as string;

  //  const searchParams = useSearchParams();
  //  const vacancyId = searchParams.get("vacancyid");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    resume: null,
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Submitted", formData);
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Apply for {vacancyId}</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="First Name"
            className="w-full rounded border p-2"
            required
          />
          <input
            type="text"
            placeholder="Middle Name"
            className="w-full rounded border p-2"
          />
          <input
            type="text"
            placeholder="Last Name"
            className="w-full rounded border p-2"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded border p-2"
            required
          />
          <input
            type="text"
            placeholder="Contact Number"
            className="w-full rounded border p-2"
          />
        </div>
        <div>
          <label className="block font-medium">Resume*</label>
          <input
            type="file"
            className="w-full rounded border p-2"
            accept=".docx,.doc,.odt,.pdf,.rtf,.txt"
            required
          />
        </div>
        <input
          type="text"
          placeholder="Enter comma separated keywords..."
          className="w-full rounded border p-2"
        />
        <textarea
          placeholder="Notes"
          className="w-full rounded border p-2"
          rows={3}
        ></textarea>
        <div className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <label>Consent to keep data</label>
        </div>
        <button
          type="submit"
          className="w-full rounded bg-blue-600 p-2 text-white"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
