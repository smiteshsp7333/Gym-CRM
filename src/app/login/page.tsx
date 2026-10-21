import { Suspense } from "react";
import { ExecutiveLoginPage } from "@/components/ExecutiveLoginPage";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#07080c] flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-[#ccff00] animate-spin" />
        </div>
      }
    >
      <ExecutiveLoginPage />
    </Suspense>
  );
}
