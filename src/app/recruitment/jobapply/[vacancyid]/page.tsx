"use client";
import ApplyForVacancy from "@/components/Recruitment/ApplicatonForm"
import React from "react";

interface PageProps {
  params: {
    vacancyid: string;
  };
}

function ApplicationForm({ params }: PageProps) {
  return <ApplyForVacancy vacancyid={params.vacancyid} />;
}

export default ApplicationForm;
