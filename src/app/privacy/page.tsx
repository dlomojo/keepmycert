import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-gray max-w-none">
          <h2>Google Calendar Integration</h2>
          <p>
            KeepMyCert integrates with Google Calendar to help you manage certification expiration reminders. 
            Here&apos;s what you need to know:
          </p>
          
          <h3>What Data We Access</h3>
          <ul>
            <li><strong>Calendar Events</strong>: We create reminder events for your certification expirations</li>
            <li><strong>Calendar Metadata</strong>: We access basic calendar information to create events</li>
          </ul>
          
          <h3>How We Use This Data</h3>
          <ul>
            <li>Create calendar events 30 days before your certifications expire</li>
            <li>Update or delete reminder events when you modify certification dates</li>
            <li>Sync certification data with your calendar for better organization</li>
          </ul>
          
          <h3>Data Storage and Security</h3>
          <ul>
            <li>Google Calendar tokens are encrypted and stored securely in our database</li>
            <li>We never store your actual calendar events or personal calendar data</li>
            <li>You can revoke access at any time through your Google Account settings</li>
          </ul>
          
          <h3>Your Rights</h3>
          <ul>
            <li>You can disconnect Google Calendar integration at any time</li>
            <li>Disconnecting will remove all created reminder events</li>
            <li>We will delete your Google Calendar tokens when you disconnect</li>
          </ul>
          
          <h2>Contact Information</h2>
          <p>
            If you have questions about this privacy policy or our Google Calendar integration, 
            please contact us at privacy@keepmycert.com
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}