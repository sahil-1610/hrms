"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { useState, ChangeEvent } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

interface Employee {
  employeeid: number;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  experience: string;
  profileImage: string;
}

const initialEmployees: Employee[] = [
  {
    employeeid: 1,
    fullName: "Aarav Patel",
    email: "aarav.patel@example.com",
    phone: "+91 9876543210",
    department: "Software Engineering",
    experience: "5 years",
    profileImage: "/images/user/user-06.png",
  },
  {
    employeeid: 2,
    fullName: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+91 9123456789",
    department: "Data Science",
    experience: "3 years",
    profileImage: "/images/user/user-07.png",
  },
  {
    employeeid: 3,
    fullName: "Rohan Mehta",
    email: "rohan.mehta@example.com",
    phone: "+91 9988776655",
    department: "DevOps",
    experience: "4 years",
    profileImage: "/images/user/user-08.png",
  },
  {
    employeeid: 4,
    fullName: "Simran Kaur",
    email: "simran.kaur@example.com",
    phone: "+91 9876501234",
    department: "Human Resources",
    experience: "6 years",
    profileImage: "/images/user/user-09.png",
  },
  {
    employeeid: 5,
    fullName: "Rahul Singh",
    email: "rahul.singh@example.com",
    phone: "+91 9876505678",
    department: "Marketing",
    experience: "4 years",
    profileImage: "/images/user/user-10.png",
  },
];

const ManageEmployee: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter employees by name based on search term.
  const filteredEmployees = employees.filter((employee) =>
    employee.fullName.toLowerCase().includes(searchTerm.toLowerCase().trim()),
  );

  const handleDelete = async (employeeid: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this user?",
    );
    if (!confirmDelete) return;

    try {
      // Simulate API deletion.
      setEmployees((prev) =>
        prev.filter((emp) => emp.employeeid !== employeeid),
      );
      toast.success("Employee deleted successfully!");
    } catch (error) {
      toast.error("Error deleting employee.");
    }
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-200">
          Manage Employees
        </h1>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search employee by name..."
            className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-gray-900 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm text-gray-900 dark:text-gray-300">
            <thead className="bg-gray-100 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-200">
              <tr>
                <th className="border px-4 py-3">Employee Name</th>
                <th className="border px-4 py-3">Department</th>
                <th className="border px-4 py-3">Experience</th>
                <th className="border px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr
                  key={employee.employeeid}
                  className="transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="border px-4 py-3 text-black dark:text-white">
                    <Link
                      href={`/employees/${employee.employeeid}`}
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {employee.fullName}
                    </Link>
                  </td>
                  <td className="border px-4 py-3">{employee.department}</td>
                  <td className="border px-4 py-3">{employee.experience}</td>
                  <td className="border px-4 py-3">
                    <div className="flex gap-4">
                      <Link
                        href={`/employees/${employee.employeeid}`}
                        className="text-blue-600 hover:underline dark:text-blue-400"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleDelete(employee.employeeid)}
                        className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ManageEmployee;
