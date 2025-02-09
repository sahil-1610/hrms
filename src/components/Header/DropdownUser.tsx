"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ClickOutside from "@/components/ClickOutside";
import { User, Settings, Briefcase, LogOut } from "lucide-react";

const DropdownUser: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4 focus:outline-none"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            Thomas Anree
          </span>
          <span className="block text-xs text-gray-500 dark:text-gray-400">
            HR
          </span>
        </span>

        <span className="h-12 w-12 rounded-full">
          <Image
            width={112}
            height={112}
            src={"/images/user/user-01.png"}
            className="h-full w-full rounded-full"
            alt="User"
          />
        </span>

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
                href="/adminprofile"
                className="flex items-center gap-3 text-sm font-medium text-gray-700 duration-300 ease-in-out hover:text-primary dark:text-gray-300"
              >
                <User size={20} />
                My Profile
              </Link>
            </li>
            <li className="mt-3">
              <Link
                href="/admin/maintainence"
                className="flex items-center gap-3 text-sm font-medium text-gray-700 duration-300 ease-in-out hover:text-primary dark:text-gray-300"
              >
                <Settings size={20} />
                Settings
              </Link>
            </li>
            <li className="mt-3">
              <Link
                href="/recruitment/jobapply"
                className="flex items-center gap-3 text-sm font-medium text-gray-700 duration-300 ease-in-out hover:text-primary dark:text-gray-300"
              >
                <Briefcase size={20} />
                Recruitment Page
              </Link>
            </li>
          </ul>

          <button className="flex w-full items-center gap-3 px-6 py-4 text-sm font-medium text-gray-700 duration-300 ease-in-out hover:text-primary dark:text-gray-300">
            <LogOut size={20} />
            Log Out
          </button>
        </div>
      )}
    </ClickOutside>
  );
};

export default DropdownUser;
