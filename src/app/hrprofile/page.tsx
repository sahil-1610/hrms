"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Pen } from "lucide-react";
// import Cookies from "js-cookie"; // You can remove this if you no longer need to read the token

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
  // Remove token state if using HTTP-only cookies.
  // const [token, setToken] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    coverImage: "/images/cover/cover-01.png",
    profileImage: "",
    name: "",
    position: "",
    email: "",
    phone: "",
    department: "",
    experience: "",
    about: "",
  });

  // Store file objects for preview and later upload.
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  // No need to retrieve token on the client if it's HTTP-only.
  // useEffect(() => {
  //   const storedToken = Cookies.get("token");
  //   if (storedToken) {
  //     setToken(storedToken);
  //   }
  // }, []);

  // When component mounts, fetch the HR profile.
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
          setProfileData((prev) => ({ ...prev, ...data.data }));
        } else {
          console.error("Failed to fetch profile:", data.message);
        }
      } catch (error) {
        console.error("Fetch profile error:", error);
      }
    };
    fetchProfile();
  }, []);

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

      if (field === "coverImage") {
        setCoverImageFile(event.target.files[0]);
      } else if (field === "profileImage") {
        setProfileImageFile(event.target.files[0]);
      }
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", profileData.name);
      formData.append("position", profileData.position);
      formData.append("email", profileData.email);
      formData.append("phone", profileData.phone);
      formData.append("department", profileData.department);
      formData.append("experience", profileData.experience);
      formData.append("about", profileData.about);
      // Uncomment below if you want to update cover image as well:
      // if (coverImageFile) {
      //   formData.append("coverImage", coverImageFile);
      // }
      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }

      const res = await fetch(`/api/hrprofile`, {
        method: "PUT",
        // Remove Authorization header if you rely solely on HTTP-only cookies.
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
        credentials: "include", // Ensure cookies are sent
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }
      if (data.success && data.data) {
        setProfileData((prev) => ({ ...prev, ...data.data }));
      }
      console.log("Profile updated successfully:", data.data);
      setIsEditing(false);
    } catch (error: any) {
      console.error("Update error:", error);
      alert(`Error updating profile: ${error.message}`);
    }
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Breadcrumb pageName="Profile" />

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-strokedark dark:bg-gray-900">
          {/* Cover Image Section */}
          <div className="relative h-60 md:h-80">
            <Image
              src={profileData.coverImage || "/images/cover/cover-01.png"}
              alt="Profile cover"
              className="h-full w-full object-cover"
              width={970}
              height={260}
              priority
            />
            <div className="absolute right-2 top-2 flex space-x-2">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-full bg-white p-2 shadow hover:bg-gray-100"
                  title="Edit Profile"
                >
                  <Pen size={16} className="text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* Profile Details Section */}
          <div className="relative -mt-16 px-6 pb-6">
            <div className="flex flex-col items-center">
              {/* Profile Image */}
              <div className="relative h-32 w-32 rounded-full border-4 border-white shadow-lg dark:border-gray-800">
                <Image
                  src={profileData.profileImage || "/images/user/user-06.png"}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="h-full w-full rounded-full object-cover"
                />
                {isEditing && (
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
                    <Pen size={14} />
                  </label>
                )}
              </div>

              {/* Editable HR Details */}
              <div className="mt-6 w-full space-y-4 text-left">
                {(
                  [
                    "name",
                    "position",
                    "email",
                    "phone",
                    "department",
                    "experience",
                    "about",
                  ] as const
                ).map((key) => (
                  <div key={key} className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData[key]}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      />
                    ) : (
                      <p className="rounded-md bg-gray-100 px-3 py-2 text-gray-900 dark:bg-gray-700 dark:text-white">
                        {profileData[key]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Save Changes Button */}
              {isEditing && (
                <div className="mt-8 w-full">
                  <button
                    onClick={handleSave}
                    className="w-full rounded-md bg-green-600 px-6 py-2 text-white hover:bg-green-700"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default HRProfile;
