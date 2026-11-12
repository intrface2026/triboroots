import { Suspense } from "react";
import { cookies } from "next/headers";
import Hero from "@/components/Hero";
import LostTrailGate from "@/components/LostTrailGate";
import { PEEK_COOKIE_NAME, verifyPeekToken } from "@/lib/peekAuth";

async function PeekGateContent() {
  const cookieStore = await cookies();
  const token = cookieStore.get(PEEK_COOKIE_NAME)?.value;
  const hasUnlocked = verifyPeekToken(token);

  return hasUnlocked ? <Hero /> : <LostTrailGate />;
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div
          aria-busy="true"
          className="flex min-h-dvh w-full items-center justify-center bg-[#f0e9d7]"
        />
      }
    >
      <PeekGateContent />
    </Suspense>
  );
}
