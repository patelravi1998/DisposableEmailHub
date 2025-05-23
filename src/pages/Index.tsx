import { useState, useEffect } from 'react';
import { Navigation } from '../components/Navigation';
import { EmailGenerator } from '../components/EmailGenerator';
import { Inbox } from '../components/Inbox';
import { AboutSection } from '../components/AboutSection';
import { Testimonials } from '../components/Testimonials';
import { Footer } from '../components/Footer';
import { Toaster } from 'sonner';
import { Shield, Lock, Mail, Clock } from 'lucide-react';
import { useTranslation } from "react-i18next";
import {LanguageSelector} from '../components/LanguageSelector'
const Index = () => {
  const { t } = useTranslation();
  const [currentEmail, setCurrentEmail] = useState('');
  console.log(`>>>>>currentEmailinbox`,currentEmail)
  const [expirationDate, setExpirationDate] = useState<string | null>(null);
  const features = [{
    icon: Shield,
    title: t("Anonymous Protection"),
    description: t("Generate burner emails for ultimate online privacy")
  }, {
    icon: Lock,
    title: t("Secure & Private"),
    description: t("Create disposable temporary email addresses with no registration")
  }, {
    icon: Mail,
    title: t("Social Media Ready"),
    description: t("Perfect temporary mail for Facebook verification and sign-ups")
  }, {
    icon: Clock,
    title: t("Auto-Expiring"),
    description: t("Your throwaway mail automatically deletes after use")
  }];

  // Function to get expiration date from localStorage
  const getExpirationDate = (email: string) => {
    if (!email) return null;
    const expirationKey = `emailExpiration_${email}`;
    const expirationDateStr = localStorage.getItem(expirationKey);
    return expirationDateStr ? new Date(expirationDateStr) : null;
  };

  // Format date to show in the message
  const formatExpirationDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Update expiration date when currentEmail changes
  useEffect(() => {
    if (currentEmail) {
      const expDate = getExpirationDate(currentEmail);
      setExpirationDate(expDate ? formatExpirationDate(expDate) : null);
    } else {
      setExpirationDate(null);
    }
  }, [currentEmail]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-accent/20">
      <Toaster position="top-center" />
      <Navigation />
  
      {/* Hero Section */}
      <header className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center mb-12">
          {/* Language Selector */}
          <div className="mb-6 flex justify-center">
            <LanguageSelector />
          </div>
  
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t("Best Disposable Email Service")}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            {t(
              "Create instant throwaway mail addresses for Facebook, online registrations, and more. Our disposable email IDs keep your real inbox clean and secure."
            )}
          </p>
          
          {/* Updated notice message with dynamic expiration date */}
          {expirationDate && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
              <p className="font-bold text-blue-600">
                Your email will expire on: {expirationDate}
              </p>
            </div>
          )}
          {!localStorage.getItem("authToken") ? (
  <p style={{ color: 'red', fontWeight: 'bold', marginBottom: '10px' }}>
    🔴 Note: If you generate a new email while logged out, it won’t be saved. To keep it and manage subscriptions, please log in. Once logged in, you’ll see that email  select it and can take a subscription from there.
  </p>
) : (
  <p style={{ color: 'red', fontWeight: 'bold', marginBottom: '10px' }}>
    🔴 Note: If you want to generate a new email, logout first, generate the email, then log in. You’ll see it in the dropdown — select it to view incoming mails and take a subscription.
  </p>
)}

        </div>
  
        <main className="max-w-3xl mx-auto">
          <EmailGenerator onEmailGenerated={setCurrentEmail} currentEmail={currentEmail} />
          <Inbox currentEmail={currentEmail} />
        </main>
      </header>
  
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("Why Choose Our Disposable Email Service?")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <article key={index} className="p-6 rounded-xl bg-accent/10 hover:bg-accent/20 transition-colors">
                <feature.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
  
      {/* Benefits Section */}
      <section className="py-16 bg-accent/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            {t("Benefits of Our Temporary Email Service")}
          </h2>
          <div className="max-w-3xl mx-auto prose lg:prose-lg">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none">
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span>{t("Perfect for Facebook account verification")}</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                <span>{t("Create unlimited disposable email IDs")}</span>
              </li>
              <li className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary flex-shrink-0" />
                <span>{t("Best throwaway mail service for privacy")}</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                <span>{t("Temporary addresses that auto-expire")}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
  
      <AboutSection />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;