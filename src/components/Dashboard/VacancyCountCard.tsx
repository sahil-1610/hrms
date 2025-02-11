import React from "react";

function VacancyCountCard() {
  return (
    <div className="rounded bg-white p-4 shadow dark:bg-gray-700">
      <h2 className="text-xl font-medium text-gray-900 dark:text-white">
        Active Vacancies
      </h2>
      <div className="text-3xl font-bold text-gray-900 dark:text-white">35</div>
    </div>
  );
}

export default VacancyCountCard;
