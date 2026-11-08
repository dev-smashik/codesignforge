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
  const succeeded = state.status === "success";

  // Live validation — button lights up with the accent colour only when
  // the typed address looks like a real email.
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  // After success the form resets to idle so a new address can be entered.
  const canSubmit = isValid && !submitting;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    if (!isValid) {
      setState({ status: "error" });
      return;
    }

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
      ? "✓ You're on the list! Watch your inbox for launch updates."
      : state.status === "duplicate"
        ? "You're already on the waitlist — no need to sign up twice."
        : state.status === "error"
          ? !isValid && email.trim() !== ""
            ? "Please enter a valid email address."
            : "Something went wrong. Please try again in a moment."
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
            onChange={(event) => {
              setEmail(event.target.value);
              if (state.status === "error" || state.status === "success") {
                setState({ status: "idle" });
              }
            }}
            disabled={submitting}
            className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-muted focus:outline-none disabled:opacity-60 lg:text-base"
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
          disabled={!canSubmit}
          aria-disabled={!canSubmit}
          className={
            "flex h-10 shrink-0 items-center justify-center gap-1 overflow-clip rounded-pill border pl-3 pr-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fd4f24] sm:gap-2.5 sm:px-4 lg:gap-2.5 lg:px-5 lg:text-base " +
            (succeeded
              ? "border-transparent bg-[#16a34a] text-white"
              : submitting
                ? "border-transparent bg-[#fd4f24] text-white opacity-80"
                : canSubmit
                  ? "border-transparent bg-[#fd4f24] text-white hover:bg-[#e0441d] active:bg-[#c73b18]"
                  : "border-line-cta bg-linear-to-b from-[#3a3a3a] to-[#565656] text-[#aaa]")
          }
        >
          {submitting ? (
            <svg
              aria-hidden="true"
              className="size-4 shrink-0 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-90"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : succeeded ? (
            <svg
              aria-hidden="true"
              className="size-4 shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : (
            <img
              src="/landing/icon-arrow-right.svg"
              alt=""
              aria-hidden="true"
              className="size-4 shrink-0"
              width={16}
              height={16}
            />
          )}
          <span className="whitespace-nowrap">
            {succeeded ? "You're in!" : submitting ? "Adding you…" : "Get Notified"}
          </span>
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
