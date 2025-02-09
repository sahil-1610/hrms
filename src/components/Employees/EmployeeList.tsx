"use client";
import React from "react";
import Link from "next/link";

interface Employee {
  employeeid: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  experience: string;
  linkedIn: string;
  notes: string;
  category: string;
}

const employee: Employee[] = [
  {
    employeeid: 1,
    fullName: "Aarav Patel",
    email: "aarav.patel@example.com",
    phone: "+91 9876543210",
    address: "Mumbai, India",
    education: "B.Tech in Computer Science",
    experience: "3 years",
    linkedIn: "https://linkedin.com/in/aaravpatel",
    notes: "Full-stack developer with 3 years of experience.",
    category: "Software Engineer",
  },
  {
    employeeid: 2,
    fullName: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+91 9123456789",
    address: "Bangalore, India",
    education: "B.Sc in Data Science",
    experience: "2 years",
    linkedIn: "https://linkedin.com/in/priyasharma",
    notes: "Skilled in data analysis and visualization.",
    category: "Data Scientist",
  },
  {
    employeeid: 3,
    fullName: "Rohan Mehta",
    email: "rohan.mehta@example.com",
    phone: "+91 9988776655",
    address: "Hyderabad, India",
    education: "Diploma in DevOps",
    experience: "4 years",
    linkedIn: "https://linkedin.com/in/rohanmehta",
    notes: "DevOps engineer with expertise in CI/CD pipelines.",
    category: "DevOps Engineer",
  },
];

const EmployeeList: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 dark:shadow-lg">
      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-200">
        Employee List
      </h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-left text-sm text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-200">
            <tr>
              <th className="px-4 py-3">Employee Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Experience</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employee.map((employee) => (
              <tr
                key={employee.employeeid}
                className="border-b bg-white transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                  <Link
                    href={`/candidates/${employee.employeeid}`}
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {employee.fullName}
                  </Link>
                </td>
                <td className="px-4 py-3">{employee.email}</td>
                <td className="px-4 py-3">{employee.category}</td>
                <td className="px-4 py-3">{employee.experience}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/employees/${employee.employeeid}`}
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
