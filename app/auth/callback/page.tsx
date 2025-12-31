import { validateCASTicket, buildCASLoginUrl, getServiceUrl } from "@/lib/cas";
import { logAuth } from "@/lib/logger";
import Link from "next/link";
import { FaTelegram } from "react-icons/fa";

interface PageProps {
  searchParams: Promise<{ ticket?: string }>;
}

export default async function AuthCallback({ searchParams }: PageProps) {
  const params = await searchParams;
  const ticket = params.ticket;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const casServerUrl = process.env.CAS_SERVER_URL || "https://sso.gatech.edu/cas";
  const telegramLink = process.env.TELEGRAM_INVITE_LINK || "https://t.me/+YOUR_INVITE_CODE_HERE";
  const serviceUrl = getServiceUrl(baseUrl);
  const loginUrl = buildCASLoginUrl(casServerUrl, serviceUrl);

  if (!ticket) {
    return <ErrorPage message="No ticket received" loginUrl={loginUrl} />;
  }

  const result = await validateCASTicket(casServerUrl, ticket, serviceUrl);

  if (result.success && result.user) {
    await logAuth(result.user);
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-[#0a0a0a]">
        <a
          href={telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-2.5 rounded border border-[#262626] text-[#fafafa] text-sm font-medium transition-colors hover:bg-[#141414] hover:border-[#404040]"
          style={{ borderWidth: '0.5px' }}
        >
          <FaTelegram className="text-base" />
          Join Telegram
        </a>
      </main>
    );
  }

  return <ErrorPage message={result.error || "Authentication failed"} loginUrl={loginUrl} />;
}

function ErrorPage({ message, loginUrl }: { message: string; loginUrl: string }) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-4 bg-[#0a0a0a]">
      <p className="text-[#666] text-sm">{message}</p>
      <Link
        href={loginUrl}
        className="px-6 py-2.5 rounded border border-[#262626] text-[#fafafa] text-sm font-medium transition-colors hover:bg-[#141414] hover:border-[#404040]"
        style={{ borderWidth: '0.5px' }}
      >
        Try Again
      </Link>
    </main>
  );
}
