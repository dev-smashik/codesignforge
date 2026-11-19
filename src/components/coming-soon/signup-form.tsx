"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { subscribeEmailSchema } from "@/lib/notification-schema";

const assets = "/figma/";

export function SignupForm() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "duplicate" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const parsed = subscribeEmailSchema.safeParse(
      Object.fromEntries(new FormData(event.currentTarget)),
    );

    if (!parsed.success) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const result = (await response.json().catch(() => null)) as {
        message?: unknown;
      } | null;

      if (response.status === 201) {
        setStatus("success");
        return;
      }

      if (response.status === 409) {
        setStatus("duplicate");
        setMessage("You're already on the notification list!");
        return;
      }

      setStatus("error");
      setMessage(
        typeof result?.message === "string"
          ? result.message
          : "Something went wrong. Please try again.",
      );
    } catch {
      setStatus("error");
      setMessage("Unable to connect. Please check your connection and try again.");
    }
  }

  const isComplete = status === "success" || status === "duplicate";
  const buttonClassName =
    "inline-flex h-10 flex-none items-center justify-center gap-2 rounded-full border-0 py-2 pr-3 pl-4 text-base leading-[1.48] font-medium text-white transition-[filter] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#f28b6c] motion-reduce:transition-none max-md:px-2 max-md:pl-3 max-md:text-sm max-md:leading-[1.8] disabled:cursor-not-allowed";

  return (
    <>
      <form
        className="flex h-20 w-[min(100%,620px)] items-center p-3 max-md:h-auto max-md:w-full max-md:p-0"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="flex min-h-14 w-full min-w-0 max-w-full items-center justify-between gap-3 overflow-hidden rounded-full border border-[#2e2e2e] bg-[#1a1a1a] py-2 pr-2 pl-4 focus-within:border-[#555] max-md:gap-2 max-md:p-2">
          <Image src={`${assets}9cd12.svg`} width={20} height={20} alt="" />
          <input
            className="w-full min-w-0 border-0 bg-transparent p-0 text-base leading-[1.48] text-white outline-none placeholder:text-[#777980] placeholder:opacity-100 max-md:text-sm max-md:leading-[1.8] max-md:placeholder:tracking-[-0.2px]"
            aria-label="Email address"
            name="email"
            type="email"
            placeholder="Enter your email address"
            autoComplete="email"
            disabled={status === "loading"}
            onChange={() => {
              if (isComplete || status === "error") {
                setStatus("idle");
                setMessage("");
              }
            }}
          />
          <button
            className={`${buttonClassName} ${status === "success" ? "bg-green-700" : "bg-[linear-gradient(180deg,#dc532c,#a9421b)] hover:brightness-110"}`}
            type="submit"
            disabled={isComplete || status === "loading"}
          >
            {status === "loading" ? (
              <>
                <span
                  className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                  aria-hidden="true"
                />
                <span>Submitting...</span>
              </>
            ) : status === "success" ? (
              <span>Submitted ✓</span>
            ) : status === "duplicate" ? (
              <span>Already Subscribed</span>
            ) : (
              <>
                <span>Get Notified</span>
                <Image src={`${assets}c797b.svg`} width={16} height={16} alt="" />
              </>
            )}
          </button>
        </div>
      </form>
      {message && (
        <p
          className={`mt-2 text-center text-sm ${status === "error" ? "text-red-300" : "text-white/80"}`}
          role={status === "error" ? "alert" : "status"}
        >
          {message}
        </p>
      )}
    </>
  );
}
