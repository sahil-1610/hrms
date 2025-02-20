// /src/app/recruitment/viewcandidates/[candidateid]/interview/page.tsx
"use client";
import React from "react";
import ScheduleInterview from "@/components/Recruitment/ScheduleInterview";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

interface InterviewPageProps {
  params: {
    candidateid: string;
  };
}

const InterviewPage: React.FC<InterviewPageProps> = ({
  params: { candidateid },
}) => {
  return (
    <DefaultLayout>
      <ScheduleInterview candidateId={candidateid} />
    </DefaultLayout>
  );
};

export default InterviewPage;
