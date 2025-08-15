// app/(legal)/cookies/page.tsx
import { Metadata } from "next";
import CookiePreferencesForm from "./preferences";

export const metadata: Metadata = {
  title: "Cookie Policy | KeepMyCert",
  description: "How KeepMyCert uses cookies and how you can control them.",
};

export default function CookiePolicyPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12 prose prose-neutral dark:prose-invert">
      <h1>Cookie Policy</h1>
      <p><strong>Last updated:</strong> August 15, 2025</p>

      <p>
        KeepMyCert (“we”, “us”) uses cookies and similar technologies to run our site,
        keep you signed in, and (optionally) understand how the product is used so we can
        improve it. You can control non‑essential cookies below.
      </p>

      <h2>What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device by your browser. They can be
        “session” (deleted when you close the browser) or “persistent”.
      </p>

      <h2>Categories we use</h2>
      <ul>
        <li>
          <strong>Essential</strong> – Required for core functionality (e.g., sign‑in,
          security, load balancing). These cannot be turned off.
        </li>
        <li>
          <strong>Analytics</strong> – Help us understand usage (pages visited, features
          used) to improve reliability and UX. Set only with your consent.
        </li>
      </ul>

      <h2>Third parties</h2>
      <p>
        If enabled, we may use an analytics provider (e.g., Google Analytics or PostHog)
        that sets its own cookies. Their use is governed by their privacy policies.
      </p>

      <h2>How to control cookies</h2>
      <p>
        Use the controls below to set your preferences. You can also block or delete
        cookies via your browser settings, but the site may not function properly without
        essential cookies.
      </p>

      <CookiePreferencesForm />
    </main>
  );
}
