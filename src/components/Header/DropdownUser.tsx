"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ClickOutside from "@/components/ClickOutside";
import { User, Settings, Briefcase, LogOut } from "lucide-react";

interface HRProfileData {
  name: string;
  email: string;
  profileImage: string;
  // Add any additional fields as needed.
}

const DropdownUser: React.FC = () => {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [profile, setProfile] = useState<HRProfileData | null>(null);

  // When the token is available, fetch the HR profile.
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/hrprofile`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Ensure cookies are sent
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setProfile((prev) => ({ ...prev, ...data.data }));
        } else {
          console.error("Failed to fetch profile:", data.message);
        }
      } catch (error) {
        console.error("Fetch profile error:", error);
      }
    };
    fetchProfile();
  }, []);

  // Logout function: remove token and redirect to sign in page.
  const handleLogout = async () => {
    try {
      // Call the sign-out API endpoint to clear the cookie.
      const res = await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include", // Ensure cookies are sent with the request.
      });
      if (res.ok) {
        // Redirect to the sign-in page after successful logout.
        router.push("/auth/signin");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4 focus:outline-none"
      >
        {profile ? (
          <>
            <span className="hidden text-right lg:block">
              <span className="block text-sm font-medium text-black dark:text-white">
                {profile.name}
              </span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">
                {profile.email}
              </span>
            </span>
            <span className="h-12 w-12 rounded-full">
              <Image
                src={profile.profileImage || "/images/user/user-06.png"}
                alt="User"
                width={112}
                height={112}
                className="h-full w-full rounded-full object-cover"
              />
            </span>
          </>
        ) : (
          <span className="h-12 w-12 rounded-full bg-gray-200" />
        )}
        <span className="hidden text-gray-500 dark:text-gray-400 sm:block">
          ▼
        </span>
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-4 w-64 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <ul className="flex flex-col border-b border-gray-200 px-6 py-5 dark:border-gray-700">
            <li>
              <Link
                href="/hrprofile"
                className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300"
              >
                <User size={20} />
                My Profile
              </Link>
            </li>
            <li className="mt-3">
              <Link
                href="/admin/manage-employee"
                className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300"
              >
                <Settings size={20} />
                Settings
              </Link>
            </li>
            <li className="mt-3">
              <Link
                href="/recruitment/jobapply"
                className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300"
              >
                <Briefcase size={20} />
                Recruitment Page
              </Link>
            </li>
          </ul>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-6 py-4 text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300"
          >
            <LogOut size={20} />
            Log Out
          </button>
        </div>
      )}
    </ClickOutside>
  );
};

export default DropdownUser;
