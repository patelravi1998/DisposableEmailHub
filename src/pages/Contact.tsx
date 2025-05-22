import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigation } from '../components/Navigation';
import { Mail, MessageSquare, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Footer } from '../components/Footer';

const Contact = () => {
  const { t } = useTranslation();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    message: ''
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: false, message: '' });

    try {
      // Client-side validation
      if (!formData.name || !formData.email || !formData.mobile || !formData.message) {
        throw new Error(t("Please fill in all fields"));
      }

      if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        throw new Error(t("Please enter a valid email address"));
      }

      // Mobile number validation (basic - at least 10 digits)
      if (!/^[0-9]{10,15}$/.test(formData.mobile)) {
        throw new Error(t("Please enter a valid mobile number (10-15 digits)"));
      }

      const response = await fetch(`${API_BASE_URL}/users/user_info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          mobile: formData.mobile, // Added mobile to the request
          message: formData.message
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t("Failed to send message"));
      }

      setSubmitStatus({
        success: true,
        message: t("Your message has been sent successfully!")
      });
      setFormData({ name: '', email: '', mobile: '', message: '' }); // Reset form
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: error.message || t("An error occurred while sending your message")
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-xl shadow-sm animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-center">{t("Send us a Message")}</h2>
            {submitStatus.message && (
              <div className={`mb-6 p-4 rounded-lg ${submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {submitStatus.message}
              </div>
            )}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("Name")} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                    placeholder={t("Your name")}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("Email")} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                    placeholder={t("Your email")}
                    required
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("Mobile Number")} *
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                    placeholder={t("Your mobile number")}
                    pattern="[0-9]{10,15}"
                    title={t("Please enter 10-15 digit mobile number")}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("Message")} *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors h-32"
                    placeholder={t("Your message")}
                    required
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? t("Sending...") : t("Send Message")}
              </Button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;