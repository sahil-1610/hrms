import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";

function Maintainence(): JSX.Element {
  return (
    <DefaultLayout>
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Feature Coming Soon!
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            We are working hard to bring you this feature. Stay tuned for updates
            and thank you for your patience.
          </p>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default Maintainence;
