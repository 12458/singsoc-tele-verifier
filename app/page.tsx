import { buildCASLoginUrl, getServiceUrl } from "@/lib/cas";
import Link from "next/link";

export default function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const casServerUrl = process.env.CAS_SERVER_URL || "https://sso.gatech.edu/cas";
  const serviceUrl = getServiceUrl(baseUrl);
  const loginUrl = buildCASLoginUrl(casServerUrl, serviceUrl);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-3 p-4 bg-[#0a0a0a]">
      <Link
        href={loginUrl}
        className="px-6 py-2.5 rounded border border-[#262626] text-[#fafafa] text-sm font-medium transition-colors hover:bg-[#141414] hover:border-[#404040]"
        style={{ borderWidth: '0.5px' }}
      >
        Login with GT SSO
      </Link>
      <p className="text-[#666] text-xs">Required to verify GT student status.</p>
    </main>
  );
}
