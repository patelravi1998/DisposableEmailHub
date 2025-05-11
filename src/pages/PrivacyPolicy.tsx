import React from "react";
import { Helmet } from "react-helmet";
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <Helmet>
        <title>Privacy Policy | TempMail Service</title>
        <meta name="description" content="Learn how we protect your privacy with our temporary email service." />
      </Helmet>

      <Navigation />

      <main className="flex-grow container mx-auto px-4 py-12 mt-16 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
          <header className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Privacy Policy</h1>
            <p className="text-gray-500 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
          </header>

          <section className="prose prose-blue max-w-none">
            <article>
              <h2>Introduction</h2>
              <p>
                Welcome to our temporary email generation service. We value your privacy and are committed to protecting your personal information. This policy outlines how we collect, use, and safeguard your data.
              </p>
            </article>

            <article>
              <h2>Information We Collect</h2>
              <p>We may collect the following types of information to operate our service:</p>
              <ul>
                <li><strong>Account Information:</strong> We generate and store the temporary email address.</li>
                <li><strong>Usage Data:</strong> Includes IP address, browser type, pages visited, and session duration.</li>
                <li><strong>Technical Data:</strong> Device, OS, and network details.</li>
                <li><strong>Email Content:</strong> Temporarily stored email messages received at your temporary address.</li>
              </ul>
            </article>

            <article>
              <h2>How We Use Your Information</h2>
              <p>We use this information to:</p>
              <ul>
                <li>Provide and improve our services</li>
                <li>Enhance website performance and security</li>
                <li>Analyze usage and detect potential threats</li>
                <li>Comply with legal obligations</li>
              </ul>
            </article>

            <article>
              <h2>Data Security</h2>
              <p>We take your data seriously and implement protective measures such as:</p>
              <ul>
                <li>Encryption and access control</li>
                <li>Regular security audits</li>
                <li>Recommendations against using temp emails for sensitive data</li>
              </ul>
            </article>

            <article>
              <h2>Data Retention</h2>
              <ul>
                <li>Temporary emails are deleted after 24 hours of inactivity</li>
                <li>Email contents are deleted when the temp address expires</li>
                <li>Usage logs are retained for up to 30 days for monitoring</li>
              </ul>
            </article>

            <article>
              <h2>Your Rights</h2>
              <p>Depending on your jurisdiction, you may request:</p>
              <ul>
                <li><strong>Access:</strong> Your personal data</li>
                <li><strong>Deletion:</strong> Erasure of stored data</li>
                <li><strong>Correction:</strong> Rectification of errors</li>
                <li><strong>Objection:</strong> To certain data usage practices</li>
              </ul>
              <p>Contact us below to exercise these rights.</p>
            </article>

            <article>
              <h2>Third-Party Services</h2>
              <ul>
                <li>Analytics tools to understand user behavior</li>
                <li>Hosting providers for infrastructure</li>
                <li>Security vendors to prevent abuse</li>
              </ul>
              <p>These third parties are bound by confidentiality agreements.</p>
            </article>

            <article>
              <h2>Changes to This Privacy Policy</h2>
              <p>
                We may update this policy. You’ll be notified through our website. Please check this page periodically.
              </p>
            </article>

            <article>
              <h2>Contact Us</h2>
              <p>
                For privacy concerns or to exercise your rights, email us at{" "}
                <a href="mailto:tempemailbox080@gmail.com" className="text-blue-600 hover:underline">
                  tempemailbox080@gmail.com
                </a>. We aim to respond within 30 days.
              </p>
            </article>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
