
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Facebook, Instagram, Linkedin, Twitter, Mail, MapPin, Phone } from "lucide-react";

export const Footer = () => {
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
                <p className="text-lg">House-09, Rd no. 15, Mecca, Saudi Arabia</p>
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
              Quick Links
            </h3>
            <ul className="space-y-4">
              {[
                "Home",
                "Services",
                "Features",
                "News",
                "Blogs",
              ].map((item, index) => (
                <li key={index} className="transform hover:translate-x-2 transition-transform">
                  <a href="#" className="text-gray-600 hover:text-primary transition-colors text-lg flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary/20" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-8 transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              Subscribe to Newsletter
            </h3>
            <p className="text-gray-600 text-lg">
              Stay updated with our latest features and releases.
            </p>
            <div className="glass p-2 rounded-xl premium-shadow relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-blue-500/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <div className="flex gap-2 relative z-10">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
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
              By subscribing you agree to our{" "}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t text-center relative z-10">
          <p className="text-gray-600 animate-fade-in text-lg">
            ©{new Date().getFullYear()} Temp Mail. All rights reserved.
          </p>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute -left-40 bottom-0 w-96 h-96 bg-gradient-to-t from-primary/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute -right-40 top-0 w-96 h-96 bg-gradient-to-b from-blue-500/5 to-transparent rounded-full blur-3xl" />
    </footer>
  );
};
