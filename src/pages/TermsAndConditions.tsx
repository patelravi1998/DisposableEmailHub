import React from "react";
import { Helmet } from "react-helmet";
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <Navigation />
      <Helmet>
        <title>Terms and Conditions | TempEmailBox.com</title>
        <meta name="description" content="Read the terms and conditions for using TempEmailBox.com, your trusted temporary email service." />
      </Helmet>

      <main className="flex-grow container mx-auto px-4 py-8 mt-16 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Terms and Conditions</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </header>

          <div className="prose max-w-none">
            <article className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Introduction</h2>
              <p className="text-gray-700">
                Welcome to <strong>TempEmailBox.com</strong> (<a href="http://tempemailbox.com" className="text-blue-600 hover:underline">http://tempemailbox.com</a>), your trusted temporary email generation service. 
                By using our website, you agree to comply with the following terms and conditions. If you do not agree, please do not use our service.
              </p>
            </article>

            <article className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Service Description</h2>
              <p className="text-gray-700">
                TempEmailBox.com provides temporary email services that allow you to create and use disposable email addresses for privacy and security purposes. 
                Our platform helps you avoid spam and protect your personal inbox from unnecessary exposure.
              </p>
            </article>

            <article className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">User Responsibilities</h2>
              <p className="text-gray-700 mb-4">
                As a user of TempEmailBox.com, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Use the service in a lawful and ethical manner</li>
                <li>Not engage in any illegal activity using our service</li>
                <li>Not spam or misuse temporary email addresses</li>
                <li>Not use the service for fraudulent or malicious purposes</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </article>

            <article className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Account Security</h2>
              <p className="text-gray-700">
                You are responsible for maintaining the security of your temporary email session and should immediately notify us of any unauthorized use. 
                We recommend not using TempEmailBox.com for sensitive communications as temporary emails may be accessible to others.
              </p>
            </article>

            <article className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Prohibited Uses</h2>
              <p className="text-gray-700 mb-4">
                You may not use TempEmailBox.com for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Spamming or sending unsolicited emails</li>
                <li>Engaging in illegal activities or violating intellectual property rights</li>
                <li>Any activity that could harm the website or other users</li>
                <li>Creating accounts for prohibited services</li>
                <li>Bypassing email verification for malicious purposes</li>
              </ul>
            </article>

            <article className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Limitation of Liability</h2>
              <p className="text-gray-700">
                TempEmailBox.com is not liable for any damages resulting from the use or inability to use our service, including any errors, interruptions, or misuse. 
                The service is provided "as is" without warranties of any kind.
              </p>
            </article>

            <article className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Changes to Terms</h2>
              <p className="text-gray-700">
                We reserve the right to update or modify these terms and conditions at any time. 
                Any changes will be reflected on this page with the revised date. Your continued use of TempEmailBox.com constitutes acceptance of the updated terms.
              </p>
            </article>

            <article className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Governing Law</h2>
              <p className="text-gray-700">
                These terms and conditions are governed by the laws of the jurisdiction in which TempEmailBox.com operates. 
                Any disputes will be resolved in the appropriate courts of that jurisdiction.
              </p>
            </article>

            <article>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions regarding these terms, please contact our support team at{" "}
                <a href="mailto:support@tempemailbox.com" className="text-blue-600 hover:underline">support@tempemailbox.com</a>. 
                We typically respond within 24-48 hours.
              </p>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
