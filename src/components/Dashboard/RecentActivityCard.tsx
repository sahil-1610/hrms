import React from "react";

const RecentActivityCard: React.FC = () => {
  return (
    <div className="rounded bg-white p-4 shadow dark:bg-gray-700">
      <h2 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
        Recent Activity
      </h2>
      {/* Replace the static list with dynamic content as needed */}
      <ul className="list-disc pl-5 text-gray-900 dark:text-white">
        <li>Employee John Doe joined.</li>
        <li>Vacancy for UI/UX Designer posted.</li>
        <li>Candidate Jane Smith interviewed.</li>
      </ul>
    </div>
  );
};

export default RecentActivityCard;
