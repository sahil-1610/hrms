"use client";
import React from "react";
import Link from "next/link";

interface Employee {
  employeeid: number;
  name: string;
  department: string;
  experience: string;
}

const employees: Employee[] = [
  {
    employeeid: 1,
    name: "Aarav Patel",
    department: "Software Engineering",
    experience: "5 years",
  },
  {
    employeeid: 2,
    name: "Priya Sharma",
    department: "Data Science",
    experience: "3 years",
  },
  {
    employeeid: 3,
    name: "Rohan Mehta",
    department: "DevOps",
    experience: "4 years",
  },
  {
    employeeid: 4,
    name: "Simran Kaur",
    department: "Human Resources",
    experience: "6 years",
  },
];

const EmployeeList: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
      <h1 className="mb-4 text-2xl font-bold">Employee List</h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="px-6 py-3">Employee Name</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Experience</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr
                key={employee.employeeid}
                className="border-b bg-white hover:bg-gray-50"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  <Link
                    href={`/employees/${employee.employeeid}`}
                    className="text-blue-600 hover:underline"
                  >
                    {employee.name}
                  </Link>
                </td>
                <td className="px-6 py-4">{employee.department}</td>
                <td className="px-6 py-4">{employee.experience}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
