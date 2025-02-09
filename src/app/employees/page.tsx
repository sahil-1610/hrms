import EmployeeList from "@/components/Employees/EmployeeList";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";

function EmployeeListShow() {
  return (
    <DefaultLayout>
      <EmployeeList />
    </DefaultLayout>
  );
}

export default EmployeeListShow;
