"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";

interface ActivityEntry {
  id: number;
  date: string;
  type: string;
  description: string;
  performance: number; // rating 1-5
}

interface EmployeeData {
  department?: string;
  hireDate?: string;
  performanceScore?: string;
}

export interface Person {
  _id?: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  experience: string;
  linkedIn?: string;
  role: "candidate" | "employee";
  status: "active" | "inactive";
  resume?: string;
  profileImage?: string;
  employeeData?: EmployeeData;
  activities?: ActivityEntry[];
  letters?: string[];
}

const PersonProfile: React.FC = () => {
  const params = useParams();
  const employeeid = params?.employeeid as string;
  const [person, setPerson] = useState<Person | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [newActivity, setNewActivity] = useState({
    type: "",
    description: "",
    performance: 3,
  });

  // Fetch all person data (profile, activities, performance, etc.)
  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const res = await fetch(`/api/employees/${employeeid}`);
        const json = await res.json();
        if (json.success) {
          // Ensure activities is defined (default to empty array)
          setPerson({ ...json.data, activities: json.data.activities || [] });
        }
      } catch (error) {
        console.error("Error fetching person", error);
      }
    };
    fetchPerson();
  }, [employeeid]);

  if (!person) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  // Update a top-level field (profile data only) for PUT request
  const handleInputChange = (field: keyof Person, value: string) => {
    setPerson((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  // Update a nested field in employeeData (e.g. department, hireDate)
  const handleEmployeeDataChange = (
    field: keyof EmployeeData,
    value: string,
  ) => {
    setPerson((prev) =>
      prev
        ? {
            ...prev,
            employeeData: { ...(prev.employeeData || {}), [field]: value },
          }
        : prev,
    );
  };

  // Handle profile image file input change
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImageFile(e.target.files[0]);
    }
  };

  // Update profile data using the PUT route (activities excluded on server side)
  const handleSaveChanges = async () => {
    const formData = new FormData();
    // Append only profile fields (activities field is excluded)
    formData.append("fullName", person.fullName);
    formData.append("email", person.email);
    formData.append("phone", person.phone);
    formData.append("address", person.address);
    formData.append("education", person.education);
    formData.append("experience", person.experience);
    if (person.linkedIn) formData.append("linkedIn", person.linkedIn);
    formData.append("role", person.role);
    formData.append("status", person.status);
    if (person.employeeData?.department)
      formData.append(
        "employeeData.department",
        person.employeeData.department,
      );
    if (person.employeeData?.hireDate)
      formData.append("employeeData.hireDate", person.employeeData.hireDate);
    // Note: Do NOT send "activities" in this request
    if (profileImageFile) formData.append("profileImage", profileImageFile);

    try {
      const res = await fetch(`/api/employees/${employeeid}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setPerson(data.data);
      }
    } catch (error) {
      console.error("Update failed", error);
    }
    setIsEditing(false);
  };

  // Add a new activity using the separate /activities route
  const handleAddActivity = async () => {
    try {
      const res = await fetch(`/api/employees/${employeeid}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newActivity),
      });
      const data = await res.json();
      if (data.success) {
        // Update local state with new activity and updated performance score
        setPerson({
          ...person,
          activities: [
            ...(person.activities || []),
            {
              id: Date.now(),
              date: new Date().toISOString().split("T")[0],
              ...newActivity,
            },
          ],
          employeeData: {
            ...(person.employeeData || {}),
            performanceScore: data.data.performanceScore,
          },
        });
      }
    } catch (error) {
      console.error("Failed to add activity", error);
    }
    setNewActivity({ type: "", description: "", performance: 3 });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Profile Section */}
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <div className="flex flex-col items-center md:flex-row md:justify-between">
          {/* Profile image and basic info */}
          <div className="mb-4 flex flex-col items-center md:mb-0 md:flex-row md:space-x-6">
            <div className="relative h-32 w-32 overflow-hidden rounded-full">
              <Image
                src={person.profileImage || "/images/default-profile.png"}
                alt={`${person.fullName}'s profile`}
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="mb-2 text-center text-3xl font-bold text-gray-900 dark:text-white md:text-left">
                {person.fullName}
              </h1>
              <p className="text-center text-gray-600 dark:text-gray-300 md:text-left">
                {person.employeeData?.department || ""}
              </p>
            </div>
          </div>
          <div>
            {isEditing ? (
              <button
                onClick={handleSaveChanges}
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Save Changes
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
        {isEditing && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
              Update Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400"
            />
          </div>
        )}

        {/* Person Details (each field explicitly rendered) */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={person.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="w-full rounded border bg-white p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <p className="text-gray-800 dark:text-gray-200">
                {person.fullName}
              </p>
            )}
          </div>
          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={person.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full rounded border bg-white p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <p className="text-gray-800 dark:text-gray-200">{person.email}</p>
            )}
          </div>
          {/* Phone */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Phone
            </label>
            {isEditing ? (
              <input
                type="text"
                value={person.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full rounded border bg-white p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <p className="text-gray-800 dark:text-gray-200">{person.phone}</p>
            )}
          </div>
          {/* Address */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Address
            </label>
            {isEditing ? (
              <input
                type="text"
                value={person.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="w-full rounded border bg-white p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <p className="text-gray-800 dark:text-gray-200">
                {person.address}
              </p>
            )}
          </div>
          {/* Education */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Education
            </label>
            {isEditing ? (
              <input
                type="text"
                value={person.education}
                onChange={(e) => handleInputChange("education", e.target.value)}
                className="w-full rounded border bg-white p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <p className="text-gray-800 dark:text-gray-200">
                {person.education}
              </p>
            )}
          </div>
          {/* Experience */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Experience
            </label>
            {isEditing ? (
              <input
                type="text"
                value={person.experience}
                onChange={(e) =>
                  handleInputChange("experience", e.target.value)
                }
                className="w-full rounded border bg-white p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <p className="text-gray-800 dark:text-gray-200">
                {person.experience}
              </p>
            )}
          </div>
          {/* LinkedIn */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              LinkedIn
            </label>
            {isEditing ? (
              <input
                type="text"
                value={person.linkedIn || ""}
                onChange={(e) => handleInputChange("linkedIn", e.target.value)}
                className="w-full rounded border bg-white p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <p className="text-gray-800 dark:text-gray-200">
                {person.linkedIn}
              </p>
            )}
          </div>
          {/* Role */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Role
            </label>
            {isEditing ? (
              <input
                type="text"
                value={person.role}
                onChange={(e) => handleInputChange("role", e.target.value)}
                className="w-full rounded border bg-white p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <p className="text-gray-800 dark:text-gray-200">{person.role}</p>
            )}
          </div>
          {/* Status */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Status
            </label>
            {isEditing ? (
              <input
                type="text"
                value={person.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full rounded border bg-white p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <p className="text-gray-800 dark:text-gray-200">
                {person.status}
              </p>
            )}
          </div>
          {/* Employee Data: Department */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Department
            </label>
            {isEditing ? (
              <input
                type="text"
                value={person.employeeData?.department || ""}
                onChange={(e) =>
                  handleEmployeeDataChange("department", e.target.value)
                }
                className="w-full rounded border bg-white p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <p className="text-gray-800 dark:text-gray-200">
                {person.employeeData?.department}
              </p>
            )}
          </div>
          {/* Employee Data: Hire Date */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Hire Date
            </label>
            {isEditing ? (
              <input
                type="date"
                value={
                  person.employeeData?.hireDate
                    ? person.employeeData.hireDate.split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  handleEmployeeDataChange("hireDate", e.target.value)
                }
                className="w-full rounded border bg-white p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <p className="text-gray-800 dark:text-gray-200">
                {person.employeeData?.hireDate
                  ? new Date(person.employeeData.hireDate).toLocaleDateString()
                  : ""}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Activities & Performance Section */}
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          Activities & Performance
        </h2>
        <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Overall Performance Score
          </h3>
          <div className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
            {person.employeeData?.performanceScore || "0"} / 5
          </div>
        </div>
        {/* Activity Form for Adding New Activity */}
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
        {/* Display Activity History */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Activity History
          </h3>
          {person.activities && person.activities.length > 0 ? (
            person.activities.map((activity, index) => (
              <div
                key={index}
                className="rounded-lg border p-4 dark:border-gray-600"
              >
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {activity.type}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(activity.date).toLocaleDateString()}
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
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No activities recorded yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonProfile;
