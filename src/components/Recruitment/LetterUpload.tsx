"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

function LetterUpload() {
  // Extract employeeId from URL. The dynamic route folder should be [employeeid]
  const { employeeid } = useParams() as { employeeid: string };

  const [letterType, setLetterType] = useState("offer");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingLetter, setExistingLetter] = useState<any | null>(null);

  // Fetch employee details to check if a letter of the selected type already exists and is sent.
  useEffect(() => {
    async function fetchEmployeeData() {
      if (!employeeid) return;
      try {
        const res = await fetch(`/api/employees/${employeeid}`);
        if (!res.ok) {
          console.error("Failed to fetch employee details");
          return;
        }
        const data = await res.json();
        // Find letter of the selected type
        const letterForType = data.data.letters?.find(
          (letter: any) => letter.letterType === letterType,
        );
       // console.log(letterForType);
        setExistingLetter(letterForType);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    }
    fetchEmployeeData();
  }, [employeeid, letterType]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeid || !file) {
      setMessage("Missing employee ID or file.");
      return;
    }
    // If the letter already exists and is sent, do not allow re-upload.
    if (existingLetter && existingLetter.isSent === true) {
      setMessage("This letter has already been sent.");
      return;
    }
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("employeeId", employeeid);
    formData.append("letterType", letterType);
    formData.append("file", file);

    try {
      const res = await fetch("/api/employees/pending-letters/send-letters", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Error uploading letter");
      } else {
        setMessage("Letter uploaded and emailed successfully.");
      }
    } catch (error) {
      setMessage("Error uploading letter");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-gray-100">
          Upload Letter
        </h2>
        {message && (
          <p className="mb-4 text-center text-m text-green-500">{message}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <span className="block text-gray-700 dark:text-gray-300">
              Employee ID: {employeeid}
            </span>
          </div>
          <div className="mb-4">
            <span className="mb-2 block text-gray-700 dark:text-gray-300">
              Letter Type
            </span>
            <div className="flex space-x-4">
              <label className="flex items-center text-gray-700 dark:text-gray-300">
                <input
                  type="radio"
                  name="letterType"
                  value="offer"
                  checked={letterType === "offer"}
                  onChange={(e) => setLetterType(e.target.value)}
                  className="mr-2"
                />
                Offer
              </label>
              <label className="flex items-center text-gray-700 dark:text-gray-300">
                <input
                  type="radio"
                  name="letterType"
                  value="appointment"
                  checked={letterType === "appointment"}
                  onChange={(e) => setLetterType(e.target.value)}
                  className="mr-2"
                />
                Appointment
              </label>
            </div>
          </div>
          {existingLetter && existingLetter.isSent && (
            <div className="mb-4 text-center text-green-600 dark:text-green-400">
              This letter has already been sent.
            </div>
          )}
          <div className="mb-6">
            <label
              htmlFor="file"
              className="mb-2 block text-gray-700 dark:text-gray-300"
            >
              Upload PDF File
            </label>
            <input
              id="file"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full text-gray-700 dark:text-gray-300"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || (existingLetter && existingLetter.isSent)}
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition-colors duration-300 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LetterUpload;
