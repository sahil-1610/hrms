"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { toast } from "react-toastify";

interface EmployeeData {
  department?: string;
}

interface Employee {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  experience: string;
  profileImage: string;
  employeeData?: EmployeeData;
}

const DeleteEmployee: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Fetch employees from the database using the GET endpoint
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("/api/employees");
        const json = await res.json();
        if (json.success) {
          // Ensure each employee has an employeeData object
          const fetchedEmployees = json.data.map((emp: Employee) => ({
            ...emp,
            employeeData: emp.employeeData || {},
          }));
          setEmployees(fetchedEmployees);
        } else {
          toast.error("Failed to fetch employees");
        }
      } catch (error) {
        console.error("Error fetching employees", error);
        toast.error("Error fetching employees");
      }
    };
    fetchEmployees();
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter employees by name based on search term.
  const filteredEmployees = employees.filter((employee) =>
    employee.fullName.toLowerCase().includes(searchTerm.toLowerCase().trim()),
  );

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this user?",
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/employees/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setEmployees((prev) => prev.filter((emp) => emp._id !== id));
        toast.success("Employee deleted successfully!");
      } else {
        toast.error("Error deleting employee.");
      }
    } catch (error) {
      console.error("Error deleting employee", error);
      toast.error("Error deleting employee.");
    }
  };

  return (
    <>
      <Breadcrumb pageName="Delete Employee" />
      <div className="mx-auto max-w-4xl p-6">
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
                  key={employee._id}
                  className="transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="border px-4 py-3 text-black dark:text-white">
                    <Link
                      href={`/employees/${employee._id}`}
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {employee.fullName}
                    </Link>
                  </td>
                  <td className="border px-4 py-3">
                    {employee.employeeData?.department || "N/A"}
                  </td>
                  <td className="border px-4 py-3">{employee.experience}</td>
                  <td className="border px-4 py-3">
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleDelete(employee._id)}
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
    </>
  );
};

export default DeleteEmployee;
