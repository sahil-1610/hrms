import React from "react";
import EmployeeCountCard from "./EmployeeCountCard";
import VacancyCountCard from "./VacancyCountCard";
import CandidateResponseCard from "./CandidateResponseCard";
import HRGraphs from "./HRGraphs";
import RecentActivityCard from "./RecentActivityCard"; // new import

const DashboardComponent: React.FC = () => {
  return (
    <div className="bg-gray-100 p-6 dark:bg-gray-800">
      <h1 className="mb-6 text-3xl font-semibold text-gray-800 dark:text-white">
        HR Admin Dashboard
      </h1>
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <EmployeeCountCard />
        <VacancyCountCard />
        <CandidateResponseCard />
      </div>
      <HRGraphs />
      <div className="mt-6">
        <RecentActivityCard />
      </div>
    </div>
  );
};

export default DashboardComponent;
