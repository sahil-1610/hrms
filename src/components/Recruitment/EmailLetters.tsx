"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";

interface Employee {
  _id: string;
  fullName: string;
  email: string;
  letters: Array<{
    _id: string;
    letterType: "offer" | "appointment";
    isSent: boolean;
  }>;
}

const PendingLetters: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("/api/employees/pending-letters");
        if (!res.ok) {
          throw new Error("Error fetching employees");
        }
        const data: Employee[] = await res.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching pending employees:", error);
        toast.error("Error fetching pending employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleUserClick = (id: string) => {
    router.push(`/recruitment/generateletters/${id}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-xl text-gray-700 dark:text-gray-200">
          Loading...
        </div>
      </div>
    );
  }

  if (!employees.length) {
    return (
      <>
        <Breadcrumb pageName="Send Letters" />
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-xl text-gray-700 dark:text-gray-200">
            No employees with pending letters found.
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb pageName="Send Letters" />
      <div className="min-h-screen bg-gray-50 py-8 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">
              Employees with Pending Letters
            </h1>
          </div>
          <ul className="grid grid-cols-1 gap-4">
            {employees.map((employee) => (
              <li
                key={employee._id}
                onClick={() => handleUserClick(employee._id)}
                className="cursor-pointer rounded-lg border border-gray-300 p-4 shadow transition-all duration-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold">
                    {employee.fullName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {employee.letters.length} letter
                    {employee.letters.length !== 1 && "s"}
                  </div>
                </div>
                <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  {employee.email}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default PendingLetters;
