import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DashboardComponent from "@/components/Dashboard/DashboardComponent";

export const metadata: Metadata = {
  title: "HRMS",
  description: "This is HR management Dashboard",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <DashboardComponent />
      </DefaultLayout>
    </>
  );
}
