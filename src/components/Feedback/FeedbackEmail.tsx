"use client";
import React, { useState } from "react";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";

interface User {
  id: number;
  name: string;
  email: string;
}

const sampleUsers: User[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com" },
  { id: 2, name: "Bob Smith", email: "bob@example.com" },
  { id: 3, name: "Charlie Davis", email: "charlie@example.com" },
];

const FeedbackEmail: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>(sampleUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setFilteredUsers(
      sampleUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(value) ||
          user.email.toLowerCase().includes(value),
      ),
    );
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setSearch(user.name);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser) return;

    console.log({ email: selectedUser.email, subject, message });

    // Reset form
    setSelectedUser(null);
    setSearch("");
    setSubject("");
    setMessage("");
  };

  return (
    <>
      <Breadcrumb pageName="Send Feedback Email" />
      <div className="mx-auto max-w-4xl rounded-lg bg-gray-800 p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">
          Send Feedback or Notification
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Search and Select */}
          <div>
            <label className="block text-sm font-medium">Search User</label>
            <input
              type="text"
              className="w-full rounded border border-gray-300 p-2"
              value={search}
              onChange={handleSearch}
              placeholder="Search by name or email"
            />
            {search && filteredUsers.length > 0 && (
              <ul className="mt-2 rounded border border-gray-300 bg-white">
                {filteredUsers.map((user) => (
                  <li
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className="cursor-pointer p-2 hover:bg-gray-100"
                  >
                    {user.name} ({user.email})
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Email Display */}
          {selectedUser && (
            <div>
              <label className="block text-sm font-medium">User Email</label>
              <input
                type="email"
                className="w-full rounded border border-gray-300 bg-gray-100 p-2"
                value={selectedUser.email}
                readOnly
              />
            </div>
          )}

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium">Subject</label>
            <input
              type="text"
              className="w-full rounded border border-gray-300 p-2"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              placeholder="Enter subject"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium">Message</label>
            <textarea
              className="w-full rounded border border-gray-300 p-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              placeholder="Enter your message"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
            disabled={!selectedUser}
          >
            Send Email
          </button>
        </form>
      </div>
    </>
  );
};

export default FeedbackEmail;
