import { useTranslation } from 'react-i18next';
import { Navigation } from '../components/Navigation';
import { Mail, MessageSquare, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Footer } from '../components/Footer';

const Contact = () => {
  const { t } = useTranslation();

  const contactMethods = [
    {
      icon: Mail,
      title: t("Email Support"),
      description: t("Get in touch with our support team"),
      action: t("support@tempmail.com")
    },
    {
      icon: MessageSquare,
      title: t("Live Chat"),
      description: t("Chat with our support team"),
      action: t("Start Chat")
    },
    {
      icon: Globe,
      title: t("Social Media"),
      description: t("Follow us on social media"),
      action: t("Follow Us")
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
              {t("Contact Us")}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("Have questions? We're here to help. Choose your preferred method of contact below.")}
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid md:grid-cols-3 gap-8 animate-fade-in">
            {contactMethods.map((method, index) => (
              <div 
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <method.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
                <p className="text-gray-600 mb-4">{method.description}</p>
                <Button variant="outline" className="w-full">
                  {method.action}
                </Button>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-xl shadow-sm animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-center">{t("Send us a Message")}</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("Name")}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                    placeholder={t("Your name")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("Email")}
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                    placeholder={t("Your email")}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("Message")}
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors h-32"
                  placeholder={t("Your message")}
                />
              </div>
              <Button className="w-full">{t("Send Message")}</Button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
