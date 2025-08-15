"use client";

import { useEffect, useState } from "react";

type ConsentState = {
  essential: true;       // always true (not user-configurable)
  analytics: boolean;    // user choice
};

const COOKIE_NAME = "kmc_cookie_consent";
const ONE_YEAR = 60 * 60 * 24 * 365;

function readConsent(): ConsentState {
  if (typeof document === "undefined") return { essential: true, analytics: false };
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]+)`));
  if (!match) return { essential: true, analytics: false };
  try {
    const parsed = JSON.parse(decodeURIComponent(match[1]));
    return { essential: true, analytics: !!parsed.analytics };
  } catch {
    return { essential: true, analytics: false };
  }
}

function writeConsent(consent: ConsentState) {
  const value = encodeURIComponent(JSON.stringify({ analytics: consent.analytics }));
  document.cookie = `${COOKIE_NAME}=${value}; Max-Age=${ONE_YEAR}; Path=/; SameSite=Lax`;
}

export default function CookiePreferencesForm() {
  const [consent, setConsent] = useState<ConsentState>({ essential: true, analytics: false });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setConsent(readConsent());
  }, []);

  const onSave = () => {
    writeConsent(consent);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    // Dispatch a custom event so your analytics loader can react immediately
    window.dispatchEvent(new Event("kmc-consent-updated"));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
      className="not-prose mt-6 rounded-2xl border p-4 shadow-sm"
    >
      <div className="mb-4">
        <label className="flex items-start gap-3">
          <input type="checkbox" checked disabled className="mt-1" />
          <span>
            <strong>Essential cookies</strong> – Required for login, security, and core features.
          </span>
        </label>
      </div>

      <div className="mb-6">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={consent.analytics}
            onChange={(e) => setConsent((c) => ({ ...c, analytics: e.target.checked }))}
            className="mt-1"
          />
          <span>
            <strong>Analytics cookies</strong> – Help us improve KeepMyCert by collecting anonymous usage stats.
          </span>
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" className="rounded-xl border px-4 py-2 hover:bg-muted">
          Save preferences
        </button>
        {saved && <span className="text-sm opacity-80">Saved ✅</span>}
      </div>
    </form>
  );
}
