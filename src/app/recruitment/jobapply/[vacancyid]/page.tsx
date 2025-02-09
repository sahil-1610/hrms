"use client";
import ApplyForVacancy from "@/components/Recruitment/ApplicatonForm";
import React from "react";

function ApplicationForm({ params }: { params: { vacancyid: string } }) {
  return <ApplyForVacancy />;
}

export default ApplicationForm;
