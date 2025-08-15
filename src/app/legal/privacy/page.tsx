// app/(legal)/privacy/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | KeepMyCert",
  description:
    "How KeepMyCert collects, uses, and protects your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12 prose prose-neutral dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p><strong>Last updated:</strong> August 15, 2025</p>

      <p>
        This Privacy Policy explains how <strong>Detached Solutions LLC</strong> (“<strong>KeepMyCert</strong>”,
        “we”, “us”, “our”) collects, uses, and shares information when you use our
        websites, apps, and related services (collectively, the “Services”).
        By using the Services, you agree to this Policy.
      </p>

      <h2>Who we are</h2>
      <p>
        Data Controller: Detached Solutions LLC<br />
        Address: [<em>TODO: Company mailing address</em>]<br />
        Email: [<em>TODO: privacy@keepmycert.com</em>]
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>
          <strong>Account data:</strong> name, email, password hash, role, team/workspace
          associations, and settings.
        </li>
        <li>
          <strong>Certification data you provide:</strong> uploaded certificates (PDF/images),
          issuer, dates, IDs, status, renewal windows, prep plans, notes.
        </li>
        <li>
          <strong>Payment data:</strong> billing name, email, and limited payment metadata from our
          processor. <em>We do not store full card numbers.</em>
        </li>
        <li>
          <strong>Usage & device data:</strong> pages viewed, actions taken, approximate location
          (from IP), device/browser, cookies or similar identifiers; crash and performance logs.
        </li>
      </ul>

      <h2>How we use information</h2>
      <ul>
        <li>Provide and improve the Services, including AI parsing and renewal insights.</li>
        <li>Operate accounts, authentication, and security.</li>
        <li>Send notifications (renewals, product updates) and respond to support.</li>
        <li>Process payments and manage subscriptions.</li>
        <li>Analyze usage to improve reliability and features.</li>
        <li>Comply with law and enforce our <a href="/terms">Terms of Service</a>.</li>
      </ul>

      <h2>AI & automated processing</h2>
      <p>
        We use AI models to parse uploaded certificates and generate renewal and career
        insights. Parsing extracts fields like name, issuer, issue/expiry dates, and ID
        numbers; we store extracted fields and the original file so you can verify results.
      </p>

      <h2>Legal bases (EEA/UK users)</h2>
      <ul>
        <li><strong>Contract:</strong> to provide the Services you request.</li>
        <li><strong>Legitimate interests:</strong> to secure, improve, and market our Services.</li>
        <li><strong>Consent:</strong> for optional cookies/analytics where required.</li>
        <li><strong>Legal obligation:</strong> compliance with applicable laws.</li>
      </ul>

      <h2>Sharing of information</h2>
      <ul>
        <li>
          <strong>Vendors/Processors:</strong> hosting, storage, analytics, email, and payments
          providers bound by contracts (DPAs) to process on our behalf.
        </li>
        <li>
          <strong>Business transfers:</strong> during mergers, financing, or acquisition events.
        </li>
        <li>
          <strong>Legal:</strong> to comply with law, protect rights, safety, and prevent abuse.
        </li>
      </ul>

      <h2>Data retention</h2>
      <p>
        We keep personal data while your account is active and as needed for legitimate
        business purposes (e.g., records, security, legal compliance). We de‑identify or
        delete data when no longer required.
      </p>

      <h2>Your rights</h2>
      <ul>
        <li>Access, correct, or delete your data.</li>
        <li>Export your data where technically feasible.</li>
        <li>Object to or restrict certain processing.</li>
        <li>Withdraw consent (for consent‑based processing).</li>
      </ul>
      <p>
        To exercise rights, contact us at [<em>TODO: privacy@keepmycert.com</em>]. We will
        verify your request. You may also have the right to complain to your local data
        protection authority.
      </p>

      <h2>International transfers</h2>
      <p>
        We may transfer data to the United States and other countries. Where required, we
        use appropriate safeguards (e.g., SCCs) for cross‑border transfers.
      </p>

      <h2>Security</h2>
      <p>
        We use technical and organizational measures such as encryption in transit, access
        controls, least‑privilege, and logging. No method is 100% secure; keep your
        credentials safe and notify us of any suspected unauthorized access.
      </p>

      <h2>Children</h2>
      <p>
        The Services are not intended for children under 16, and we do not knowingly collect
        data from them.
      </p>

      <h2>Cookies & analytics</h2>
      <p>
        We use essential cookies for authentication and functionality. With consent where
        required, we may use analytics to understand usage. See our{" "}
        <a href="/cookies">Cookie Policy</a> for details.
      </p>

      <h2>Do Not Track</h2>
      <p>We do not respond to DNT signals at this time.</p>

      <h2>Changes</h2>
      <p>
        We may update this Policy. We’ll post changes here and update the “Last updated”
        date. Material changes may be notified by email or in‑app.
      </p>

      <h2>Contact</h2>
      <p>
        Questions? Contact us at [<em>TODO: privacy@keepmycert.com</em>] or by mail at
        the address above.
      </p>
    </main>
  );
}
