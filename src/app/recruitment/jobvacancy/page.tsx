"use client";
import { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import VacancyList from "@/components/Recruitment/ListJobVacancy";
import VacancyForm from "@/components/Recruitment/JobVacancyForm";

function CreateVacancy() {
  const [viewType, setViewType] = useState("form"); // "form" or "list"

  return (
    <DefaultLayout>
      {/* Toggle Switch */}
      <div className="mb-3 flex justify-center">
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={viewType === "list"}
            onChange={() => setViewType(viewType === "form" ? "list" : "form")}
          />
          <div className="peer flex h-10 w-100 items-center justify-between rounded-full bg-blue-600 px-3 text-sm text-white after:absolute  after:h-10 after:w-1/2 after:rounded-full after:bg-white/40 after:transition-all after:content-[''] peer-checked:bg-gray-700 peer-checked:after:translate-x-full">
            <span
              className={`w-1/2 text-center ${viewType === "form" ? "font-bold" : "opacity-60"}`}
            >
              Create Form
            </span>
            <span
              className={`w-1/2 text-center ${viewType === "list" ? "font-bold" : "opacity-60"}`}
            >
              List Vacancy
            </span>
          </div>
        </label>
      </div>

      {/* Render Based on Toggle */}
      {viewType === "form" ? <VacancyForm /> : <VacancyList />}
    </DefaultLayout>
  );
}

export default CreateVacancy;
