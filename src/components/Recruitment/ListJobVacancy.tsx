"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import React from "react";
import Link from "next/link";

const vacancies = [
  {
    id: 1,
    name: "Software Engineer",
    title: "Frontend Developer",
    description: "Develop and maintain web applications using React.js.",
    hiringManager: "John Doe",
    positions: 3,
    isActive: true,
    url: "https://opensource-demo.orangehrmlive.com/web/index.php/recruitmentApply/jobs.html",
  },
  {
    id: 2,
    name: "Backend Engineer",
    title: "Node.js Developer",
    description: "Build and manage backend services using Node.js and Express.",
    hiringManager: "Jane Smith",
    positions: 2,
    isActive: false,
    url: "https://opensource-demo.orangehrmlive.com/web/index.php/recruitmentApply/jobs.html",
  },
];

const VacancyList = () => {
  return (
    <>
      <Breadcrumb pageName="Vacancy List" />

      <div className="mx-auto max-w-3xl gap-2 rounded-md bg-white p-6 shadow-md dark:bg-boxdark">
        <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
          Vacancy List
        </h2>

        {vacancies.map((vacancy) => (
          <div
            key={vacancy.id}
            className="mb-4 rounded-lg border border-stroke bg-transparent p-4 dark:border-form-strokedark dark:bg-form-input"
          >
            <h3 className="text-lg font-medium text-black dark:text-white">
              {vacancy.name} ({vacancy.title})
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {vacancy.description}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Hiring Manager:</strong> {vacancy.hiringManager}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Positions:</strong> {vacancy.positions}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Active:</strong> {vacancy.isActive ? "Yes" : "No"}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Apply Link:</strong> {vacancy.url}
            </p>
            <div className="mx-3 my-2">
              <Link
                href="#"
                className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-8"
              >
                Update
              </Link>
              <Link
                href="#"
                className="mx-3 inline-flex items-center justify-center rounded-full bg-primary px-10 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-8"
              >
                Delete
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default VacancyList;
