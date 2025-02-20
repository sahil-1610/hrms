"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

interface Candidate {
  _id: string;
  fullName: string;
  email: string;
  linkedIn?: string;
  resume?: string;
  vacancyId?: string;
}

interface Interview {
  _id: string;
  candidate: string;
  vacancy: string;
  interviewDate: string;
  interviewTime: string;
  additionalNotes?: string;
  status: "scheduled" | "completed" | "cancelled";
}

const ScheduleInterview: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const candidateIdFromUrl = params?.candidateid as string;

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loadingCandidate, setLoadingCandidate] = useState<boolean>(true);
  const [interviewDate, setInterviewDate] = useState<string>("");
  const [interviewTime, setInterviewTime] = useState<string>("");
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [scheduledInterview, setScheduledInterview] =
    useState<Interview | null>(null);

  // Fetch candidate details using candidateIdFromUrl.
  useEffect(() => {
    if (!candidateIdFromUrl) return;
    const fetchCandidate = async () => {
      setLoadingCandidate(true);
      try {
        const res = await fetch(
          `/api/recruitment/candidateresponse/${candidateIdFromUrl}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
        );
        const data = await res.json();
        if (res.ok && data.success) {
          // If API returns an array, pick the first candidate.
          const fetchedCandidate = Array.isArray(data.data)
            ? data.data[0]
            : data.data;
          setCandidate(fetchedCandidate);
        } else {
          setMessage(data.message || "Candidate not found");
        }
      } catch (error) {
        console.error("Fetch candidate error:", error);
        setMessage("Error fetching candidate details");
      } finally {
        setLoadingCandidate(false);
      }
    };
    fetchCandidate();
  }, [candidateIdFromUrl]);

  // Handle scheduling interview (POST /api/recruitment/interviews/schedule)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!candidateIdFromUrl) {
      setMessage("Candidate ID is not available.");
      return;
    }
    setLoading(true);
    setMessage("");

    const payload = {
      candidateId: candidateIdFromUrl,
      interviewDate,
      interviewTime,
      additionalNotes,
    };

    try {
      const res = await fetch("/api/recruitment/interviews/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Interview scheduled and emails sent.");
        setScheduledInterview(data.data);
      } else {
        setMessage(data.message || "Failed to schedule interview.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error scheduling interview.");
    } finally {
      setLoading(false);
    }
  };

  // Handle marking interview as completed (PATCH /api/recruitment/interviews/[id])
  const handleMarkCompleted = async () => {
    if (!scheduledInterview) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(
        `/api/recruitment/interviews/${scheduledInterview._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "completed" }),
        },
      );
      const data = await res.json();
      if (res.ok) {
        setMessage("Interview marked as completed.");
        setScheduledInterview(data.data);
      } else {
        setMessage(data.message || "Failed to update interview.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error updating interview.");
    } finally {
      setLoading(false);
    }
  };

  // Handle cancelling interview (DELETE /api/interviews/[id])
  const handleCancelInterview = async () => {
    if (!scheduledInterview) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(
        `/api/recruitment/interviews/${scheduledInterview._id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        },
      );
      const data = await res.json();
      if (res.ok) {
        setMessage("Interview cancelled successfully.");
        setScheduledInterview(null);
      } else {
        setMessage(data.message || "Failed to cancel interview.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error cancelling interview.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Candidate Interview" />
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Schedule Interview for{" "}
            {loadingCandidate
              ? "Loading..."
              : candidate?.fullName || "Candidate"}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            <strong>Note:</strong> While scheduling the interview, both the
            candidate and the hiring manager will receive an email with the
            interview details.
          </p>
          {!scheduledInterview ? (
            <form onSubmit={handleSubmit}>
              {/* Interview Date Field */}
              <div className="mb-4">
                <label
                  htmlFor="interviewDate"
                  className="mb-1 block font-medium text-gray-700 dark:text-gray-300"
                >
                  Interview Date
                </label>
                <input
                  type="date"
                  id="interviewDate"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100"
                  required
                />
              </div>
              {/* Interview Time Field */}
              <div className="mb-4">
                <label
                  htmlFor="interviewTime"
                  className="mb-1 block font-medium text-gray-700 dark:text-gray-300"
                >
                  Interview Time
                </label>
                <input
                  type="time"
                  id="interviewTime"
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100"
                  required
                />
              </div>
              {/* Additional Notes Field */}
              <div className="mb-4">
                <label
                  htmlFor="additionalNotes"
                  className="mb-1 block font-medium text-gray-700 dark:text-gray-300"
                >
                  Additional Notes
                </label>
                <textarea
                  id="additionalNotes"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  rows={4}
                  placeholder="Please bring your portfolio or online meeting link."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100"
                ></textarea>
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700 disabled:bg-gray-400 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {loading ? "Scheduling..." : "Schedule Interview"}
              </button>
              {message && (
                <p className="mt-4 text-center text-sm text-gray-700 dark:text-gray-300">
                  {message}
                </p>
              )}
            </form>
          ) : (
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Interview Scheduled
              </h3>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                Date:{" "}
                {new Date(
                  scheduledInterview.interviewDate,
                ).toLocaleDateString()}
              </p>
              <p className="mt-1 text-gray-700 dark:text-gray-300">
                Time: {scheduledInterview.interviewTime}
              </p>
              <p className="mt-1 text-gray-700 dark:text-gray-300">
                Notes: {scheduledInterview.additionalNotes || "None"}
              </p>
              <p className="mt-1 text-gray-700 dark:text-gray-300">
                Status: {scheduledInterview.status}
              </p>
              {scheduledInterview.status === "scheduled" && (
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={handleMarkCompleted}
                    className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:bg-gray-400"
                    disabled={loading}
                  >
                    Mark Completed
                  </button>
                  <button
                    onClick={handleCancelInterview}
                    className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:bg-gray-400"
                    disabled={loading}
                  >
                    Cancel Interview
                  </button>
                </div>
              )}
              {message && (
                <p className="mt-4 text-center text-sm text-gray-700 dark:text-gray-300">
                  {message}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ScheduleInterview;
