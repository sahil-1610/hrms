// /recruitment/index.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Vacancy {
  id: number;
  name: string;
  description: string;
  positions: number;
}

export default function RecruitmentList() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);

  useEffect(() => {
    // Fetch vacancies from API (replace with actual API call)
    setVacancies([
      {
        id: 1,
        name: "Software Developer",
        description: "Develop and maintain web applications using React.js.",
        positions: 3,
      },
      {
        id: 2,
        name: "Backend Engineer",
        description:
          "Build and manage backend services using Node.js and Express.",
        positions: 2,
      },
    ]);
  }, []);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-center text-2xl font-bold">
        Recent Recruitments
      </h1>
      <div className="space-y-4">
        {vacancies.map((vacancy) => (
          <div key={vacancy.id}>
            <div className="cursor-pointer rounded-lg border p-4 shadow hover:bg-gray-100">
              <h2 className="text-lg font-semibold">{vacancy.name}</h2>
              <p className="text-gray-600">{vacancy.description}</p>
              <p className="text-gray-600">
                No of positions :{vacancy.positions}
              </p>
              <Link
                href={`/recruitment/apply/${vacancy.id}`}
                className="inline-flex items-center justify-center rounded-full bg-meta-3 px-10 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
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
