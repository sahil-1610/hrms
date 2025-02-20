"use client";
import { useParams } from "next/navigation";
import React, { useState, ChangeEvent } from "react";
import Image from "next/image";

interface Activity {
  id: number;
  date: string;
  type: string;
  description: string;
  performance: number; // 1-5 rating
}

interface Employee {
  employeeid: number;
  name: string;
  department: string;
  experience: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  linkedIn: string;
  notes: string;
  category: string;
  activities: Activity[];
  performanceScore: number;
  profileImage: string;
}

const employees: Employee[] = [
  {
    employeeid: 1,
    name: "Aarav Patel",
    department: "Software Engineering",
    experience: "5 years",
    email: "aarav.patel@example.com",
    phone: "+91 9876543210",
    address: "Mumbai, India",
    education: "B.Tech in Computer Science",
    linkedIn: "https://linkedin.com/in/aaravpatel",
    notes: "Full-stack developer with 3 years of experience.",
    category: "Software Engineer",
    activities: [],
    performanceScore: 4.2,
    profileImage: "/images/user/user-06.png",
  },
  // Add more employees if needed...
];

const EmployeeProfile: React.FC = () => {
  const params = useParams();
  const employeeid = params?.employeeid as string;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [employee, setEmployee] = useState<Employee>(
    employees.find((emp) => emp.employeeid === Number(employeeid)) ||
      employees[0],
  );
  const [newActivity, setNewActivity] = useState({
    type: "",
    description: "",
    performance: 3,
  });

  if (!employee) {
    return (
      <div className="text-center text-red-500 dark:text-red-400">
        Employee Not Found
      </div>
    );
  }

  const handleEmployeeUpdate = (field: keyof Employee, value: string) => {
    setEmployee((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddActivity = () => {
    const activity = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      ...newActivity,
    };

    setEmployee((prev) => ({
      ...prev,
      activities: [...prev.activities, activity],
      performanceScore: calculateNewPerformanceScore([
        ...prev.activities,
        activity,
      ]),
    }));

    setNewActivity({
      type: "",
      description: "",
      performance: 3,
    });
  };

  const calculateNewPerformanceScore = (activities: Activity[]) => {
    if (activities.length === 0) return 0;
    const sum = activities.reduce((acc, curr) => acc + curr.performance, 0);
    return Number((sum / activities.length).toFixed(1));
  };

  // Exclude keys that we don't want to display in the details section.
  const excludedKeys = [
    "employeeid",
    "activities",
    "performanceScore",
    "profileImage",
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Profile Section */}
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <div className="flex flex-col items-center md:flex-row md:justify-between">
          {/* Profile Image Section */}
          <div className="mb-4 flex flex-col items-center md:mb-0 md:flex-row md:space-x-6">
            <div className="relative h-32 w-32 overflow-hidden rounded-full">
              <Image
                src={employee.profileImage}
                alt={`${employee.name}'s profile`}
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="mb-2 text-center text-3xl font-bold text-gray-900 dark:text-white md:text-left">
                {employee.name}
              </h1>
              <p className="text-center text-gray-600 dark:text-gray-300 md:text-left">
                {employee.department}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
          </button>
        </div>

        {/* Employee Details */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {Object.entries(employee)
            .filter(([key]) => !excludedKeys.includes(key))
            .map(([key, value]) => (
              <div key={key} className="space-y-1">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={value as string}
                    onChange={(e) =>
                      handleEmployeeUpdate(
                        key as keyof Employee,
                        e.target.value,
                      )
                    }
                    className="w-full rounded border bg-white p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-800 dark:text-gray-200">{value}</p>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Activities & Performance Section */}
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          Activities & Performance
        </h2>

        {/* Overall Performance Score */}
        <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Overall Performance Score
          </h3>
          <div className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
            {employee.performanceScore} / 5
          </div>
        </div>

        {/* Add New Activity */}
        <div className="mb-6 space-y-4 rounded-lg border p-4 dark:border-gray-600">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Add New Activity
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Type
              </label>
              <input
                type="text"
                value={newActivity.type}
                onChange={(e) =>
                  setNewActivity((prev) => ({ ...prev, type: e.target.value }))
                }
                className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Project, Training, Achievement"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Performance Rating (1-5)
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={newActivity.performance}
                onChange={(e) =>
                  setNewActivity((prev) => ({
                    ...prev,
                    performance: Number(e.target.value),
                  }))
                }
                className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Description
              </label>
              <textarea
                value={newActivity.description}
                onChange={(e) =>
                  setNewActivity((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                rows={3}
                placeholder="Describe the activity..."
              ></textarea>
            </div>
            <button
              onClick={handleAddActivity}
              className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 md:col-span-2"
            >
              Add Activity
            </button>
          </div>
        </div>

        {/* Activity List */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Activity History
          </h3>
          {employee.activities.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No activities recorded yet.
            </p>
          ) : (
            <div className="space-y-4">
              {employee.activities.map((activity) => (
                <div
                  key={activity.id}
                  className="rounded-lg border p-4 dark:border-gray-600"
                >
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {activity.type}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.date}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {activity.description}
                  </p>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Performance Rating:
                    <span className="font-medium text-gray-900 dark:text-white">
                      {" "}
                      {activity.performance}/5
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
