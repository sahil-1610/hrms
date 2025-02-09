"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CheckboxOne from "@/components/Checkboxes/CheckboxOne";
import SwitcherOne from "@/components/Switchers/SwitcherOne";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import MultiSelect from "@/components/FormElements/MultiSelect";
import SelectGroupTwo from "@/components/SelectGroup/SelectGroupTwo";
import SwitcherTwo from "../Switchers/SwitcherTwo";
import SwitcherThree from "../Switchers/SwitcherThree";

// Sample job descriptions, including one matching the context provided.
const sampleDescriptions: string[] = [
  `About the job  
Skills: HTML, CSS, JavaScript, React, Angular, Vue.js, Responsive Design, Git,  

Job Overview  
We are seeking a Front End Development Intern to join our team remotely. This is a fresher-level position available in multiple locations including Pune, Mumbai, Bangalore, Kolkata, Noida, and Gurgaon. This internship offers an excellent opportunity for individuals with 0 years of work experience to gain valuable industry knowledge and practical skills.

Qualifications and Skills  
- Proficiency in HTML, JavaScript, and React (Mandatory)  
- Familiarity with CSS for consistent, responsive layouts  
- Basic understanding of Angular and experience with Vue.js is a plus  
- Knowledge of responsive design principles and Git for version control  
- Strong problem-solving skills and excellent communication abilities  

Roles and Responsibilities  
- Assist in the development of front-end features using HTML, JavaScript, and React  
- Collaborate with the design team to implement user-friendly pages  
- Debug and optimize application performance  
- Participate in team meetings and engage with senior developers for guidance  

Desired Skills and Experience: HTML, CSS, JavaScript, React, Angular, Vue.js, Responsive Design, Git.`,
  "Join our team to create innovative solutions in a dynamic work environment. We value creativity, collaboration, and continuous learning. This role offers the opportunity to work on live projects, develop your technical skills, and contribute to the company's success.",
  "This position offers a unique chance for fresh graduates to enter the industry. You'll work closely with experienced developers, learn the latest technologies, and build user-friendly applications in a supportive, fast-paced environment.",
];

const VacancyForm: React.FC = () => {
  // Local state for form fields
  const [vacancyName, setVacancyName] = useState<string>("");
  const [jobTitle, setJobTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [numPositions, setNumPositions] = useState<number>(0);

  // Generate a random job description from the sample descriptions.
  const generateDescription = () => {
    const randomIndex = Math.floor(Math.random() * sampleDescriptions.length);
    setDescription(sampleDescriptions[randomIndex]);
  };

  return (
    <>
      <Breadcrumb pageName="Vacancy Form" />

      <div className="mx-auto max-w-3xl rounded-md bg-white p-6 shadow-md dark:bg-boxdark">
        <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
          Create Vacancy
        </h2>

        <form className="space-y-4">
          {/* Vacancy Name */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-white">
              Vacancy Name
            </label>
            <input
              type="text"
              placeholder="Enter vacancy name"
              value={vacancyName}
              onChange={(e) => setVacancyName(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
            />
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-white">
              Job Title
            </label>
            <input
              type="text"
              placeholder="Enter job title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-white">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Enter job description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
            ></textarea>
            <button
              type="button"
              onClick={generateDescription}
              className="mt-2 rounded bg-gray-200 px-3 py-1 text-xs font-medium text-black hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              {description ? "Generate Other" : "Generate Job Description"}
            </button>
          </div>

          {/* Hiring Manager */}
          <div>
            <SelectGroupTwo />
          </div>

          {/* Number of Positions */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-white">
              Number of Positions
            </label>
            <input
              type="number"
              placeholder="Enter number of positions"
              value={numPositions}
              onChange={(e) => setNumPositions(Number(e.target.value))}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
            />
          </div>

          {/* Is Active */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-black dark:text-white">
              Is Active
            </label>
            <SwitcherThree />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full rounded-md bg-primary px-4 py-2 text-white transition hover:bg-opacity-80"
            >
              Create Vacancy
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default VacancyForm;
