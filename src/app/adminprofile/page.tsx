"use client";

import React, { useState, ChangeEvent } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import Link from "next/link";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Facebook, Twitter, Instagram } from "lucide-react";

// Define types for the profile data
interface ProfileData {
  coverImage: string;
  profileImage: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  department: string;
  experience: string;
  about: string;
}

const HRProfile: React.FC = () => {
  // State for profile information
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    coverImage: "/images/cover/cover-01.png",
    profileImage: "/images/user/user-06.png",
    name: "Danish Heilium",
    position: "HR Manager",
    email: "hr@example.com",
    phone: "+91 9876543210",
    department: "Human Resources",
    experience: "8 years",
    about:
      "Experienced HR Manager with a proven track record in recruiting, employee engagement, and talent management. Passionate about building a positive work culture.",
  });

  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    field: keyof ProfileData,
  ) => {
    if (event.target.files && event.target.files[0]) {
      const fileURL = URL.createObjectURL(event.target.files[0]);
      setProfileData((prev) => ({ ...prev, [field]: fileURL }));
    }
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
    // Save logic can be added here.
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Breadcrumb pageName="Profile" />

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-strokedark dark:bg-boxdark">
          {/* Cover Image Section */}
          <div className="relative h-60 md:h-80">
            <Image
              src={profileData.coverImage}
              alt="Profile cover"
              className="h-full w-full object-cover"
              width={970}
              height={260}
              priority
            />
            <div className="absolute bottom-4 left-4 z-10">
              <label
                htmlFor="cover"
                className="flex cursor-pointer items-center gap-2 rounded bg-primary px-3 py-1 text-sm font-medium text-white hover:bg-opacity-90"
              >
                <input
                  type="file"
                  name="cover"
                  id="cover"
                  className="sr-only"
                  onChange={(e) => handleFileChange(e, "coverImage")}
                />
                <span>Edit Cover</span>
              </label>
            </div>
          </div>

          {/* Profile Details Section */}
          <div className="relative -mt-16 px-6 pb-6">
            <div className="flex flex-col items-center">
              {/* Profile Image Frame */}
              <div className="relative h-32 w-32 rounded-full border-4 border-white shadow-lg dark:border-strokedark">
                <Image
                  src={profileData.profileImage}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="h-full w-full rounded-full object-cover"
                />
                <label
                  htmlFor="profile"
                  className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90"
                >
                  <input
                    type="file"
                    name="profile"
                    id="profile"
                    className="sr-only"
                    onChange={(e) => handleFileChange(e, "profileImage")}
                  />
                  <Twitter size={14} />
                </label>
              </div>

              {/* Editable HR Details */}
              <div className="mt-4 w-full space-y-4 text-left">
                {Object.keys(profileData).map((key) => {
                  if (key === "coverImage" || key === "profileImage")
                    return null;

                  return (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData[key as keyof ProfileData]}
                          onChange={(e) =>
                            handleChange(
                              key as keyof ProfileData,
                              e.target.value,
                            )
                          }
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900 dark:text-white">
                          {profileData[key as keyof ProfileData]}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Edit/Save Button */}
              <div className="mt-6 w-full">
                <button
                  onClick={toggleEdit}
                  className="w-full rounded-md bg-primary px-6 py-2 font-medium text-white hover:bg-opacity-90"
                >
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </button>
              </div>

              {/* Social Links */}
              <div className="mt-8 w-full">
                <h4 className="mb-3 text-left text-lg font-medium text-gray-800 dark:text-white">
                  Follow me on
                </h4>
                <div className="flex items-center justify-start gap-4">
                  <Link
                    href="#"
                    aria-label="Facebook"
                    className="hover:text-primary"
                  >
                    <Facebook size={22} />
                  </Link>
                  <Link
                    href="#"
                    aria-label="Twitter"
                    className="hover:text-primary"
                  >
                    <Twitter size={22} />
                  </Link>
                  <Link
                    href="#"
                    aria-label="Instagram"
                    className="hover:text-primary"
                  >
                    <Instagram size={22} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default HRProfile;
