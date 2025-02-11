import React from "react";

const EmployeeCountCard: React.FC = () => {
  return (
    <div className="rounded bg-white p-4 shadow dark:bg-gray-700">
      <h2 className="text-xl font-medium text-gray-900 dark:text-white">
        Total Employees
      </h2>
      <div className="text-3xl font-bold">420</div>
    </div>
  );
};

export default EmployeeCountCard;
