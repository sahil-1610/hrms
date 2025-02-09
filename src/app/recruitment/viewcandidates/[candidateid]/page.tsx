import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CandidateOperation from "@/components/Recruitment/CandidateOperation";
import React from "react";

function CandidatePage() {
  return (
    <div>
      <DefaultLayout>
        <CandidateOperation />
      </DefaultLayout>
    </div>
  );
}

export default CandidatePage;
