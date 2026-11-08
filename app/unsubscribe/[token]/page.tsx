import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";

import { db } from "@/lib/db";
import { lookupUnsubscribeTarget } from "@/modules/email/unsubscribe";
import { SITE } from "@/lib/site";

/**
 * Unsubscribe confirmation page (Phase 3).
 *
 * GET is purely informational (link prefetchers and previews cannot
 * unsubscribe anyone); the state change happens on POST. The lookup runs
 * after `connection()` inside a Suspense boundary so Cache Components can
 * prerender the shell (AGENTS.md §7, Next 16 cacheComponents).
 */
export default function UnsubscribePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  return (
    <main className="relative flex min-h-svh items-center justify-center px-4">
      <Suspense fallback={<UnsubscribeShell />}>
        <UnsubscribeContent params={params} />
      </Suspense>
    </main>
  );
}

function UnsubscribeShell() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-line bg-panel p-6 text-center sm:p-8">
      <p className="font-brand text-xl font-semibold text-white">{SITE.name}</p>
      <p className="mt-4 text-sm text-muted">Loading…</p>
    </div>
  );
}

async function UnsubscribeContent({ params }: { params: Promise<{ token: string }> }) {
  await connection();
  const { token } = await params;
  const target = await lookupUnsubscribeTarget(db, token);

  return (
    <div className="w-full max-w-md rounded-2xl border border-line bg-panel p-6 text-center sm:p-8">
      <p className="font-brand text-xl font-semibold text-white">{SITE.name}</p>
      {target ? (
        <>
          <h1 className="mt-4 text-lg font-medium text-white">
            Stop launch emails?
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-strong">
            This will unsubscribe{" "}
            <span className="text-white">{target.email}</span> from {SITE.name}{" "}
            launch updates. You will not receive further mail unless you sign
            up again.
          </p>
          <form
            method="POST"
            action={`/api/unsubscribe/${token}`}
            className="mt-6 flex flex-col gap-3"
          >
            <button
              type="submit"
              className="h-11 rounded-full border border-line-cta bg-linear-to-b from-[#3a3a3a] to-[#565656] px-6 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Yes, unsubscribe me
            </button>
            <Link
              href="/"
              className="text-sm text-muted underline underline-offset-4"
            >
              Keep me subscribed
            </Link>
          </form>
        </>
      ) : (
        <>
          <h1 className="mt-4 text-lg font-medium text-white">
            Link unavailable
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-strong">
            This unsubscribe link is invalid or has already been used. If you
            still receive {SITE.name} emails, contact us and we will remove
            you manually.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block h-11 rounded-full border border-line bg-panel px-6 py-2.5 text-sm font-medium text-white"
          >
            Back to home
          </Link>
        </>
      )}
    </div>
  );
}
