import React from "react";
import { Helmet } from "react-helmet";
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <Navigation />
      <Helmet>
        <title>Privacy Policy | TempMail Service</title>
        <meta name="description" content="Learn how we protect your privacy with our temporary email service" />
      </Helmet>
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-16 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Privacy Policy</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </header>
          
          <div className="prose max-w-none">
            <article className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Introduction</h2>
              <p className="text-gray-700">
                Welcome to our temporary email generation service. We value your
                privacy and are committed to protecting your personal information. This
                privacy policy outlines how we collect, use, and safeguard your data when
                you use our services.
              </p>
            </article>

            <article className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                To provide our services, we may collect the following types of information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Account Information:</strong> When you create a temporary email, we generate and store the address</li>
                <li><strong>Usage Data:</strong> How you interact with our website, including your IP address, browser type, pages viewed, and session duration</li>
                <li><strong>Technical Data:</strong> Device information, operating system, and network information</li>
                <li><strong>Email Content:</strong> The content of emails received by your temporary address (stored temporarily)</li>
              </ul>
            </article>

            <article className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>To provide and maintain our temporary email services</li>
                <li>To improve and optimize our website and user experience</li>
                <li>To monitor and analyze usage patterns to enhance security</li>
                <li>To detect, prevent, and address technical issues</li>
                <li>To comply with legal obligations when required</li>
              </ul>
            </article>

            <article className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational measures to protect
                your personal data. These include encryption, access controls, and regular
                security audits. However, please be aware that:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Temporary emails are inherently less secure than permanent accounts</li>
                <li>We cannot guarantee absolute security of data transmitted online</li>
                <li>You should not use temporary emails for sensitive communications</li>
              </ul>
            </article>

            <article className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain different types of information for varying periods:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Temporary email addresses: Typically deleted after 24 hours of inactivity</li>
                <li>Email content: Automatically deleted when the temporary email expires</li>
                <li>Usage logs: Retained for up to 30 days for security purposes</li>
              </ul>
            </article>

            <article className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Your Rights</h2>
              <p className="text-gray-700 mb-4">
                Depending on your jurisdiction, you may have certain rights regarding your
                personal data:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Deletion:</strong> Request deletion of your data</li>
                <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                <li><strong>Objection:</strong> Object to certain processing activities</li>
              </ul>
              <p className="text-gray-700 mt-4">
                To exercise these rights, please contact us using the information below.
              </p>
            </article>

            <article className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Third-Party Services</h2>
              <p className="text-gray-700 mb-4">
                We may use third-party services that process limited data:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Analytics services to understand usage patterns</li>
                <li>Hosting providers to deliver our services</li>
                <li>Security services to protect against abuse</li>
              </ul>
              <p className="text-gray-700 mt-4">
                These providers are contractually obligated to protect your data.
              </p>
            </article>

            <article className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Changes to This Privacy Policy</h2>
              <p className="text-gray-700">
                We may update this policy periodically. We will notify you of significant
                changes by posting a notice on our website or through other communication
                channels. The "Last updated" date at the top indicates when changes were
                made.
              </p>
            </article>

            <article>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Contact Us</h2>
              <p className="text-gray-700">
                For privacy-related inquiries or to exercise your rights, please contact
                our Data Protection Officer at <a href="mailto:tempemailbox080@gmail.com" className="text-blue-600 hover:underline">tempemailbox080@gmail.com</a>.
                We aim to respond to all legitimate requests within 30 days.
              </p>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;