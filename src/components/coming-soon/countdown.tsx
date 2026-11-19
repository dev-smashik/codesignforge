"use client";

import { useEffect, useState } from "react";

const launchTimestamp = Date.UTC(2026, 11, 4, 11, 0, 0);

export function Countdown() {
  const [secondsRemaining, setSecondsRemaining] = useState(15 * 24 * 60 * 60);

  useEffect(() => {
    const updateCountdown = () => {
      setSecondsRemaining(
        Math.max(0, Math.floor((launchTimestamp - Date.now()) / 1000)),
      );
    };

    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const units = [
    { label: "DAYS", value: Math.floor(secondsRemaining / 86_400) },
    { label: "HOURS", value: Math.floor((secondsRemaining % 86_400) / 3_600) },
    { label: "MINUTES", value: Math.floor((secondsRemaining % 3_600) / 60) },
    { label: "SECONDS", value: secondsRemaining % 60 },
  ];

  return (
    <div
      className="flex w-full min-w-0 items-start justify-center gap-6 max-md:gap-3 max-[359px]:gap-2"
      aria-label="Launch countdown"
    >
      {units.map(({ label, value }) => {
        const digits = String(value).padStart(2, "0");

        return (
          <div
            className="flex flex-col items-center gap-3 max-md:gap-2"
            key={label}
          >
            <div
              className="flex items-center gap-2 max-md:gap-0.75"
              aria-label={`${digits} ${label.toLowerCase()}`}
            >
              <span className="grid h-20 w-12 flex-[0_0_48px] place-items-center rounded-xs bg-[linear-gradient(180deg,rgb(234_88_12/20%),rgb(2_17_23/10%))] text-5xl leading-none font-['Digital_Display'] font-normal text-white backdrop-blur-2xl max-md:h-10 max-md:w-6 max-md:flex-[0_0_24px] max-md:rounded-[1px] max-md:text-2xl max-md:backdrop-blur-lg">
                {digits[0]}
              </span>
              <span className="grid h-20 w-12 flex-[0_0_48px] place-items-center rounded-xs bg-[linear-gradient(180deg,rgb(234_88_12/20%),rgb(2_17_23/10%))] text-5xl leading-none font-['Digital_Display'] font-normal text-white backdrop-blur-2xl max-md:h-10 max-md:w-6 max-md:flex-[0_0_24px] max-md:rounded-[1px] max-md:text-2xl max-md:backdrop-blur-lg">
                {digits[1]}
              </span>
            </div>
            <span className="text-center font-brand text-xl leading-none font-normal text-white max-md:text-[10px]">
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
