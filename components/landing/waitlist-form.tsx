"use client";

import { useId, useState } from "react";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "duplicate" }
  | { status: "error" };

/**
 * Accessible waitlist signup form.
 *
 * States are announced via aria-live; a hidden honeypot field catches bots.
 * The backend route (/api/waitlist) arrives in Phase 3; until then failures
 * surface as the generic error state.
 */
export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  const statusId = useId();

  const submitting = state.status === "submitting";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const formData = new FormData(event.currentTarget);
    const website = String(formData.get("website") ?? "");
    const emailValue = String(formData.get("email") ?? "").trim();

    // Submitting is the explicit opt-in act: the request always carries
    // consent: true (and is recorded as such in the database).
    setState({ status: "submitting" });
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailValue, consent: true, website }),
        signal: AbortSignal.timeout(10_000),
      });

      if (response.ok) {
        setState({ status: "success" });
        setEmail("");
        return;
      }

      if (response.status === 409) {
        setState({ status: "duplicate" });
        return;
      }

      setState({ status: "error" });
    } catch {
      setState({ status: "error" });
    }
  }

  const statusMessage =
    state.status === "success"
      ? "You're on the list! Watch your inbox for launch updates."
      : state.status === "duplicate"
        ? "You're already on the waitlist — no need to sign up twice."
        : state.status === "error"
          ? "Something went wrong. Please try again in a moment."
          : "";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="relative w-full rounded-pill p-0 sm:p-3"
      aria-busy={submitting}
    >
      <div className="flex items-center justify-between overflow-clip rounded-pill border border-line bg-panel py-2 pl-3 pr-2 focus-within:border-[#6b6b6b] lg:pl-4">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <img
            src="/landing/brand-flower.svg"
            alt=""
            aria-hidden="true"
            className="size-7 shrink-0"
            width={28}
            height={28}
          />
          <label htmlFor={statusId} className="sr-only">
            Email address for launch updates
          </label>
          <input
            id={statusId}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Enter your email."
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-muted focus:outline-none lg:text-base"
          />
        </div>

        {/* Honeypot: hidden from users and assistive tech; bots fill it */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="pointer-events-none absolute size-0 opacity-0"
        />

        <button
          type="submit"
          disabled={submitting}
          className="flex h-10 shrink-0 items-center justify-center gap-1 overflow-clip rounded-pill border border-line-cta bg-linear-to-b from-[#3a3a3a] to-[#565656] pl-3 pr-2 text-sm font-medium text-[#aaa] transition-opacity hover:opacity-90 disabled:opacity-60 focus-visible:opacity-90 sm:gap-2.5 sm:px-4 lg:gap-2.5 lg:px-5 lg:text-base"
        >
          <span className="whitespace-nowrap">
            {submitting ? "Adding you…" : "Get Notified"}
          </span>
          <img
            src="/landing/icon-arrow-right.svg"
            alt=""
            aria-hidden="true"
            className="size-4 shrink-0"
            width={16}
            height={16}
          />
        </button>
      </div>

      {/* Consent is implied by submitting (with the notice below) and is
          recorded as an explicit opt-in by the API. The notice sits in the
          form's existing bottom gap (absolute) so measured hero positions
          never shift; it swaps for the status message after submit. */}
      {!statusMessage ? (
        <p className="pointer-events-none absolute left-0 right-0 top-full mt-8 text-center text-2.5 leading-relaxed text-muted">
          By joining, you accept launch emails. Opt out anytime.        </p>
      ) : null}

      {/* aria-live region: zero height at rest so the resting layout matches
          the design exactly; spacing only appears with a message. */}
      <p
        role="status"
        aria-live="polite"
        className={
          statusMessage
            ? "mx-auto mt-3 min-h-5 text-center text-sm text-muted-strong"
            : "mx-auto text-center text-sm text-muted-strong"
        }
      >
        {statusMessage}
      </p>
    </form>
  );
}
