"use client";
import React, { useState } from "react";

interface ApplyForVacancyProps {
  vacancyid: string;
}

export default function ApplyForVacancy({ vacancyid }: ApplyForVacancyProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    resume: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted", formData);
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Apply for {vacancyid}</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            className="w-full rounded border p-2"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full rounded border p-2"
            required
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
        <textarea
          name="notes"
          placeholder="Notes"
          className="w-full rounded border p-2"
          rows={3}
          onChange={handleChange}
        ></textarea>
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
