"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

interface Employee {
  _id: string; // Use _id from MongoDB
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

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/employees", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Send cookies with the request
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch employees");
        }
        setEmployees(data.data);
      } catch (err: any) {
        setError(err.message || "Error fetching employees");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading employees...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 dark:shadow-lg">
      <Breadcrumb pageName="Employee List" />
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
            {employees.map((employee) => (
              <tr
                key={employee._id}
                className="border-b bg-white transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                  <Link
                    href={`/candidates/${employee._id}`}
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
                    href={`/employees/${employee._id}`}
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
