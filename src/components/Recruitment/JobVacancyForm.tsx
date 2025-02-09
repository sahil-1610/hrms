"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CheckboxOne from "@/components/Checkboxes/CheckboxOne";
import SwitcherOne from "@/components/Switchers/SwitcherOne";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import MultiSelect from "@/components/FormElements/MultiSelect";
import SelectGroupTwo from "@/components/SelectGroup/SelectGroupTwo";
import SwitcherTwo from "../Switchers/SwitcherTwo";
import SwitcherThree from "../Switchers/SwitcherThree";

const VacancyForm = () => {
  return (
    <>
      <Breadcrumb pageName="Vacancy Form" />

      <div className="mx-auto max-w-3xl rounded-md bg-white p-6 shadow-md dark:bg-boxdark">
        <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
          Create Vacancy
        </h2>

        <form className="space-y-4">
          {/* Vacancy Name */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-white">
              Vacancy Name
            </label>
            <input
              type="text"
              placeholder="Enter vacancy name"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
            />
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-white">
              Job Title
            </label>
            <input
              type="text"
              placeholder="Enter job title"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-white">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Enter job description"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
            ></textarea>
          </div>

          {/* Hiring Manager */}
          <div>
            <SelectGroupTwo />
          </div>
          {/* Number of Positions */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-white">
              Number of Positions
            </label>
            <input
              type="number"
              placeholder="Enter number of positions"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
            />
          </div>

          {/* Is Active */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-black dark:text-white">
              Is Active
            </label>
            <SwitcherThree/>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full rounded-md bg-primary px-4 py-2 text-white transition hover:bg-opacity-80"
            >
              Create Vacancy
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default VacancyForm;
