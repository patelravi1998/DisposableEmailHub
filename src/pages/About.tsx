import { Navigation } from '../components/Navigation';
import { Shield, Clock, Lock } from 'lucide-react';
import { Footer } from '../components/Footer';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Shield,
      title: t("Secure & Private"),
      description: t("Your temporary emails are completely secure and private.")
    },
    {
      icon: Clock,
      title: t("Instant Access"),
      description: t("No registration required. Get your temporary email instantly.")
    },
    {
      icon: Lock,
      title: t("Data Protection"),
      description: t("We don't store any personal information.")
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-white">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              {t("About TempMail")}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("We provide secure, instant temporary email addresses for your online needs. No registration required, completely free, and privacy-focused.")}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 animate-fade-in">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Mission Statement */}
          <div className="text-center space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-900">{t("Our Mission")}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("To provide a secure and reliable temporary email service that protects your privacy while keeping the internet clean from spam.")}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
