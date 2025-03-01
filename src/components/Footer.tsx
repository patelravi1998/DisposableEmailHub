import { useState, useEffect } from "react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Facebook, Instagram, Linkedin, Twitter, Mail, MapPin, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n"; // Import i18n
import { useNavigate } from "react-router-dom"; // Import useNavigate for URL updates

export const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate(); // Initialize useNavigate
  const [showLanguages, setShowLanguages] = useState(false);

  // List of supported languages
  const languages = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "fr", label: "French", flag: "🇫🇷" },
    { code: "es", label: "Spanish", flag: "🇪🇸" },
    { code: "hi", label: "Hindi", flag: "🇮🇳" },
    { code: "ru", label: "Russian", flag: "🇷🇺" },
    { code: "nl", label: "Dutch", flag: "🇳🇱" },
    { code: "de", label: "German", flag: "🇩🇪" },
    { code: "it", label: "Italian", flag: "🇮🇹" },
    { code: "pl", label: "Polish", flag: "🇵🇱" },
    { code: "pt", label: "Portuguese", flag: "🇵🇹" },
    { code: "sr", label: "Serbian", flag: "🇷🇸" },
    { code: "tr", label: "Turkish", flag: "🇹🇷" },
    { code: "uk", label: "Ukrainian", flag: "🇺🇦" },
    { code: "ar", label: "Arabic", flag: "🇸🇦" },
    { code: "zh", label: "Chinese", flag: "🇨🇳" },
    { code: "cs", label: "Czech", flag: "🇨🇿" },
    { code: "da", label: "Danish", flag: "🇩🇰" },
    { code: "fi", label: "Finnish", flag: "🇫🇮" },
    { code: "el", label: "Greek", flag: "🇬🇷" },
    { code: "hu", label: "Hungarian", flag: "🇭🇺" },
    { code: "id", label: "Indonesian", flag: "🇮🇩" },
    { code: "ja", label: "Japanese", flag: "🇯🇵" },
    { code: "ko", label: "Korean", flag: "🇰🇷" },
    { code: "no", label: "Norwegian", flag: "🇳🇴" },
    { code: "fa", label: "Persian", flag: "🇮🇷" },
    { code: "ro", label: "Romanian", flag: "🇷🇴" },
    { code: "sv", label: "Swedish", flag: "🇸🇪" },
    { code: "th", label: "Thai", flag: "🇹🇭" },
    { code: "vi", label: "Vietnamese", flag: "🇻🇳" },
  ];

  // Function to detect user's preferred language
  const detectUserLanguage = () => {
    const browserLanguage = navigator.language.split("-")[0]; // Get the base language (e.g., "en" from "en-US")
    const supportedLanguages = languages.map((lang) => lang.code);

    // Check if the browser language is supported
    if (supportedLanguages.includes(browserLanguage)) {
      return browserLanguage;
    } else {
      return "en"; // Default to English if the browser language is not supported
    }
  };

  // Automatically set the language when the component mounts
  useEffect(() => {
    const currentPath = window.location.pathname;
    const userLanguage = detectUserLanguage();
  
    // Only navigate if the URL is just `/`
    if (currentPath === "/") {
      i18n.changeLanguage(userLanguage);
      navigate(`/${userLanguage}`);
    }
  }, []);
  

  return (
    <footer className="py-20 md:py-32 bg-gradient-to-b from-white to-accent/10 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
          {/* Company Info */}
          <div className="space-y-8 transform hover:scale-105 transition-transform duration-300">
            <Logo />
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-gray-600 hover:text-primary transition-colors group">
                <div className="glass p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <p className="text-lg">{t("House-09, Rd no. 15, Mecca, Saudi Arabia")}</p>
              </div>
              <div className="flex items-center gap-4 text-gray-600 hover:text-primary transition-colors group">
                <div className="glass p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <p className="text-lg">+966 0576 XXX XXX</p>
              </div>
              <div className="flex items-center gap-4 text-gray-600 hover:text-primary transition-colors group">
                <div className="glass p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <p className="text-lg">contact@tempmail.com</p>
              </div>
            </div>
            <div className="flex gap-4">
              {[
                { icon: Linkedin, href: "#" },
                { icon: Facebook, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Instagram, href: "#" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="glass p-3 rounded-xl hover:bg-primary hover:text-white transform hover:scale-110 transition-all duration-300 relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity" />
                  <social.icon className="w-5 h-5 relative z-10" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8 transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              {t("Quick Links")}
            </h3>
            <ul className="space-y-4">
              {["Home", "Services", "Features", "News", "Blogs"].map((item, index) => (
                <li key={index} className="transform hover:translate-x-2 transition-transform">
                  <a href="#" className="text-gray-600 hover:text-primary transition-colors text-lg flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary/20" />
                    {t(item)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-8 transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              {t("Subscribe to Newsletter")}
            </h3>
            <p className="text-gray-600 text-lg">
              {t("Stay updated with our latest features and releases.")}
            </p>
            <div className="glass p-2 rounded-xl premium-shadow relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-blue-500/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <div className="flex gap-2 relative z-10">
                <Input 
                  type="email" 
                  placeholder={t("Enter your email")} 
                  className="flex-1 focus:ring-2 focus:ring-primary/20 text-lg rounded-lg"
                />
                <Button 
                  type="submit" 
                  size="icon"
                  className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white transition-colors rounded-lg"
                >
                  →
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {t("By subscribing you agree to our")}{" "}
              <a href="#" className="text-primary hover:underline">
                {t("Privacy Policy")}
              </a>
            </p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="mt-10 flex justify-center md:justify-end relative z-50">
  <div className="relative inline-block">
    <Button
      onClick={() => setShowLanguages(!showLanguages)}
      className="bg-gradient-to-r from-primary to-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 transition-transform relative z-10"
    >
      🌍 {t("Select Language")}
    </Button>

    {showLanguages && (
      <div className="absolute left-1/2 -translate-x-1/2 md:left-auto md:right-0 mt-2 w-56 bg-white shadow-lg rounded-lg overflow-hidden border z-50 max-h-60 overflow-y-auto">
        {languages.map((lang) => (
          <button
            key={lang.code}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-primary/10 transition-all flex items-center gap-2"
            onClick={(e) => {
              e.preventDefault();
              i18n.changeLanguage(lang.code);
              navigate(`/${lang.code}`); // Update URL with language code using useNavigate
              setShowLanguages(false);
            }}
          >
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
          </button>
        ))}
      </div>
    )}
  </div>
</div>
        <div className="mt-20 pt-8 border-t text-center relative z-10">
          <p className="text-gray-600 animate-fade-in text-lg">
            ©{new Date().getFullYear()} {t("Temp Mail.")} {t("All rights reserved.")} 
          </p>
        </div>
      </div>
    </footer>
  );
};