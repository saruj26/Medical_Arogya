import { Suspense } from "react";
import ClientCreatePrescription from "./ClientCreatePrescription";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
            </div>
            <p className="text-gray-600 mt-4 font-medium">Loading...</p>
          </div>
        </div>
      }
    >
      <ClientCreatePrescription />
    </Suspense>
  );
}
