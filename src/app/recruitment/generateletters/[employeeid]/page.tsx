"use client";

import React from "react";
import LetterUpload from "@/components/Recruitment/LetterUpload";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

const SendLetters: React.FC = () => {
  return (
    <DefaultLayout>
        <LetterUpload />
    </DefaultLayout>
  );
};

export default SendLetters;
