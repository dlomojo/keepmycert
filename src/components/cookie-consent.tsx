"use client";

import { useEffect, useState } from "react";
const COOKIE_NAME = "kmc_cookie_consent";
const ONE_YEAR = 60 * 60 * 24 * 365;

function hasConsentCookie(): boolean {
  if (typeof document === "undefined") return true; // avoid flash on server
  return document.cookie.includes(`${COOKIE_NAME}=`);
}

function writeConsent(analytics: boolean) {
  const value = encodeURIComponent(JSON.stringify({ analytics }));
  document.cookie = `${COOKIE_NAME}=${value}; Max-Age=${ONE_YEAR}; Path=/; SameSite=Lax`;
  window.dispatchEvent(new Event("kmc-consent-updated"));
}

export default function CookieConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!hasConsentCookie()) setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] mx-auto w-full">
      <div className="mx-auto mb-4 max-w-3xl rounded-2xl border bg-background/95 p-4 shadow-lg backdrop-blur">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm leading-relaxed">
            We use essential cookies to run KeepMyCert, and optional analytics to improve it.
            You can change your choice anytime on our{" "}
            <a className="underline" href="/cookies">Cookie Policy</a>.
          </p>
          <div className="flex gap-2">
            <a
              href="/cookies"
              className="rounded-xl border px-3 py-2 text-sm hover:bg-muted"
              onClick={() => {
                // don’t set anything yet; let user choose on the page
              }}
            >
              Manage
            </a>
            <button
              className="rounded-xl border px-3 py-2 text-sm hover:bg-muted"
              onClick={() => {
                writeConsent(false);
                setShow(false);
              }}
            >
              Only essential
            </button>
            <button
              className="rounded-xl bg-primary px-3 py-2 text-sm text-primary-foreground hover:opacity-90"
              onClick={() => {
                writeConsent(true);
                setShow(false);
              }}
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
