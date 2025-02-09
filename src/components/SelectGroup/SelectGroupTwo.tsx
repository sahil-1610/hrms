"use client";
import React, { useState } from "react";
import {User} from "lucide-react"

const countries = ["Admin1", "Admin2", "Admin3"]; // Array of countries

const SelectGroupTwo: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

  const changeTextColor = () => {
    setIsOptionSelected(true);
  };

  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
        Select HiringManager
      </label>

      <div className="relative z-20 bg-white dark:bg-form-input">
        <span className="absolute left-4 top-1/2 z-30 -translate-y-1/2">
          {/* Icon */}
          <User />
        </span>

        <select
          value={selectedOption}
          onChange={(e) => {
            setSelectedOption(e.target.value);
            changeTextColor();
          }}
          className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${
            isOptionSelected ? "text-black dark:text-white" : ""
          }`}
        >
          <option value="" disabled className="text-body dark:text-bodydark">
            Select Manager
          </option>
          {countries.map((country, index) => (
            <option
              key={index}
              value={country}
              className="text-body dark:text-bodydark"
            >
              {country}
            </option>
          ))}
        </select>

        <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
          {/* Dropdown Arrow Icon */}
        </span>
      </div>
    </div>
  );
};

export default SelectGroupTwo;
