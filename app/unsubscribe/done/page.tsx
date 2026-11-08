import Link from "next/link";

import { SITE } from "@/lib/site";

/** Shown after a successful unsubscribe confirmation. */
export default function UnsubscribeDonePage() {
  return (
    <main className="relative flex min-h-svh items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-line bg-panel p-6 text-center sm:p-8">
        <p className="font-brand text-xl font-semibold text-white">{SITE.name}</p>
        <h1 className="mt-4 text-lg font-medium text-white">
          You&apos;re unsubscribed
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-strong">
          You will no longer receive {SITE.name} launch emails. If you change
          your mind, you can join the waitlist again at any time.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block h-11 rounded-full border border-line bg-panel px-6 py-2.5 text-sm font-medium text-white"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
