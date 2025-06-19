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
import { LanguageSelector } from '../components/LanguageSelector';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Index = () => {
  const { t } = useTranslation();
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [expirationDate, setExpirationDate] = useState<string | null>(null);

  const features = [
    {
      icon: Shield,
      title: t("Anonymous Protection"),
      description: t("Generate burner emails for ultimate online privacy")
    },
    {
      icon: Lock,
      title: t("Secure & Private"),
      description: t("Create disposable temporary email addresses with no registration")
    },
    {
      icon: Mail,
      title: t("Social Media Ready"),
      description: t("Perfect temporary mail for Facebook verification and sign-ups")
    },
    {
      icon: Clock,
      title: t("Auto-Expiring"),
      description: t("Your throwaway mail automatically deletes after use")
    }
  ];

  const formatExpirationDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const playExpiryNotification = () => {
    if (Notification.permission === 'granted') {
      const notification = new Notification("🔔 TempEmailBox.com Notice", {
        body: "We've sent you a reminder to extend your email subscription. Only ₹10/week ($0.12) to keep access. Click to renew now!",
        icon: '/logo192.png',
      });
  
      notification.onclick = () => {
        // Open your site
        window.open(window.location.origin, '_blank');
  
        // Play the tone
        const audio = new Audio('/dream11-tone.mp3');
        audio.play().catch((e) => {
          console.error("Audio play failed:", e);
        });
      };
    }
  };
  

  const isTomorrow = (dateStr: string): boolean => {
    const today = new Date();
    const date = new Date(dateStr + "T00:00:00");
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  };

  useEffect(() => {
    const fetchExpirationDate = async () => {
      if (!currentEmail) {
        setExpirationDate(null);
        return;
      }

      const expirationKey = `emailExpiration_${currentEmail}`;
      const localExpiration = localStorage.getItem(expirationKey);

      try {
        const response = await fetch(`${API_BASE_URL}/users/get_expiration_date?temporaryEmail=${currentEmail}`);
        const data = await response.json();
        const apiExpiration = data.data;
        if (!apiExpiration) return;

        const apiDateObj = new Date(`${apiExpiration}T23:59:59`);
        const apiDateStr = apiDateObj.toISOString();

        const shouldUpdate = !localExpiration || new Date(localExpiration).toISOString().slice(0, 10) !== apiExpiration;

        if (shouldUpdate) {
          localStorage.setItem(expirationKey, apiDateStr);
          setExpirationDate(formatExpirationDate(apiDateObj));
        } else {
          setExpirationDate(formatExpirationDate(new Date(localExpiration)));
        }

        if (isTomorrow(apiExpiration)) {
          Notification.requestPermission().then((perm) => {
            if (perm === 'granted') {
              playExpiryNotification();
            }
          });
        }

      } catch (err) {
        console.error("Failed to fetch expiration date:", err);
        if (localExpiration) {
          setExpirationDate(formatExpirationDate(new Date(localExpiration)));
        }
      }
    };

    fetchExpirationDate();
  }, [currentEmail]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-accent/20">
      <Toaster position="top-center" />
      <Navigation />

      <header className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="mb-6 flex justify-center">
            <LanguageSelector />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t("Best Disposable Email Service")}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            {t("Create instant throwaway mail addresses for Facebook, online registrations, and more. Our disposable email IDs keep your real inbox clean and secure.")}
          </p>

          {expirationDate && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
              <p className="font-bold text-blue-600">
                {t("Your email will expire on")}: {expirationDate}
              </p>
            </div>
          )}

          {!localStorage.getItem("authToken") ? (
            <p className="text-red-600 font-bold mb-4">
              🔴 {t("Note")}: {t("If you generate a new email while logged out, it won’t be saved. To keep it and manage subscriptions, please log in. Once logged in, you’ll see that email — select it and can take a subscription from there.")}
            </p>
          ) : (
            <p className="text-red-600 font-bold mb-4">
              🔴 {t("Note")}: {t("If you want to generate a new email, logout first, generate the email, then log in. You’ll see it in the dropdown — select it to view incoming mails and take a subscription.")}
            </p>
          )}
        </div>

        <main className="max-w-3xl mx-auto">
          <EmailGenerator onEmailGenerated={setCurrentEmail} currentEmail={currentEmail} />
          <Inbox currentEmail={currentEmail} />
        </main>
      </header>

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
