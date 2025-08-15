// app/(legal)/terms/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | KeepMyCert",
  description: "The terms that govern your use of KeepMyCert.",
};

export default function TermsPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12 prose prose-neutral dark:prose-invert">
      <h1>Terms of Service</h1>
      <p><strong>Last updated:</strong> August 15, 2025</p>

      <p>
        These Terms of Service (“<strong>Terms</strong>”) govern your access to and use of the
        Services provided by <strong>Detached Solutions LLC</strong> (“<strong>KeepMyCert</strong>”, “we”,
        “us”, “our”). By using the Services, you agree to these Terms.
      </p>

      <h2>Accounts & eligibility</h2>
      <ul>
        <li>You must be able to form a binding contract and be at least 16 years old.</li>
        <li>You are responsible for your account credentials and all activity under your account.</li>
        <li>Provide accurate information and keep it updated.</li>
      </ul>

      <h2>Subscriptions, trials & billing</h2>
      <ul>
        <li>Paid plans renew automatically unless cancelled.</li>
        <li>Trials convert to paid unless you cancel before renewal.</li>
        <li>
          Fees are exclusive of taxes. Payment processing is handled by our third‑party
          provider; we don’t store full card details.
        </li>
      </ul>

      <h2>Cancellations & refunds</h2>
      <p>
        You can cancel anytime; access continues through the current billing period. Unless
        required by law, fees are non‑refundable. If we materially fail to provide the
        Services as described, contact support and we’ll work to make it right.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>No illegal activity, infringement, or violation of others’ rights.</li>
        <li>No attempts to reverse engineer, breach, or interfere with the Services.</li>
        <li>No uploading of malware or content that is unlawful, harmful, or abusive.</li>
        <li>Respect rate limits and API terms where applicable.</li>
      </ul>

      <h2>Your content</h2>
      <p>
        You retain ownership of the content you upload (e.g., certificate files). You grant
        us a limited license to host, process (including via AI models), and display your
        content solely to operate and improve the Services. You are responsible for having
        the rights to the content you upload.
      </p>

      <h2>AI features</h2>
      <p>
        AI outputs (e.g., parsed fields, renewal or career insights) are generated
        programmatically and may be inaccurate. You should verify critical details and use
        your professional judgment. We may use de‑identified usage signals to improve
        models and features.
      </p>

      <h2>Service changes</h2>
      <p>
        We may modify, suspend, or discontinue features with notice where practicable.
        If a change materially harms paid users, we will provide notice and options.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The Services, including software, design, and content, are owned by us and our
        licensors. Except as permitted by law, do not copy, modify, or create derivative
        works of the Services.
      </p>

      <h2>Feedback</h2>
      <p>
        If you submit feedback, you grant us a non‑exclusive, perpetual, royalty‑free
        license to use it without obligation.
      </p>

      <h2>Disclaimers</h2>
      <p>
        THE SERVICES ARE PROVIDED “AS IS” WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL
        IMPLIED WARRANTIES INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
        NON‑INFRINGEMENT. We do not guarantee accuracy of AI outputs or uninterrupted
        availability.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE WILL NOT BE LIABLE FOR INDIRECT,
        INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS,
        REVENUE, DATA, OR USE, EVEN IF ADVISED OF THE POSSIBILITY. OUR TOTAL LIABILITY FOR
        ANY CLAIM RELATING TO THE SERVICES IS LIMITED TO THE AMOUNTS YOU PAID TO US IN THE
        12 MONTHS BEFORE THE EVENT GIVING RISE TO THE CLAIM.
      </p>

      <h2>Indemnification</h2>
      <p>
        You agree to defend, indemnify, and hold us harmless from claims arising out of
        your use of the Services or violation of these Terms.
      </p>

      <h2>Governing law; venue</h2>
      <p>
        These Terms are governed by the laws of the State of <em>Maryland, USA</em> (without
        regard to conflicts of laws). Courts located in <em>[TODO: County/City, MD]</em> will
        have exclusive jurisdiction. If your company is elsewhere, replace with your
        preferred venue.
      </p>

      <h2>Third‑party services</h2>
      <p>
        Third‑party links and integrations (e.g., analytics, email, payments) are governed
        by their own terms and privacy policies.
      </p>

      <h2>Termination</h2>
      <p>
        We may suspend or terminate your access for violations of these Terms, legal
        requirements, or to protect the Services or users.
      </p>

      <h2>Changes to these Terms</h2>
      <p>
        We may update these Terms. We’ll post changes here and update the “Last updated”
        date; material changes may be notified by email or in‑app. If you continue using the
        Services after changes take effect, you accept the updated Terms.
      </p>

      <h2>Contact</h2>
      <p>
        Questions? Contact us at [<em>TODO: support@keepmycert.com</em>].
      </p>
    </main>
  );
}
