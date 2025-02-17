
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export const AboutSection = () => {
  const features = [
    "No Sign up required",
    "No annoying mails",
    "No installations",
    "Secure & Private",
    "Auto-delete after expiry",
    "24/7 availability"
  ];

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white to-accent/10 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex-1 space-y-8 relative z-10"
          >
            <span className="text-primary font-medium inline-block text-lg">About temp mail</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
              Your Secure <span className="text-primary">Temporary Email</span> Solution
            </h2>
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
              Temp Mail provides disposable email addresses to protect your privacy. 
              Perfect for testing, registrations, and avoiding spam in your primary inbox.
            </p>
            <ul className="space-y-6">
              {features.map((feature, index) => (
                <motion.li 
                  key={index} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4"
                >
                  <span className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary" />
                  </span>
                  <span className="text-gray-700 text-lg">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right Images */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex-1 relative w-full min-h-[400px] md:min-h-[500px] max-w-[600px]"
          >
            <motion.div
              initial={{ opacity: 0, x: 20, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="absolute right-0 top-[5%] w-[85%] z-10"
            >
              <div className="glass p-3 rounded-2xl premium-shadow hover:shadow-lg transition-all duration-300">
                <img 
                  src="/lovable-uploads/7f23861d-bc00-470c-8f8d-3c1d6075e621.png" 
                  alt="Temporary Email Interface" 
                  className="w-full h-auto rounded-xl"
                  loading="lazy"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20, y: -20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="absolute left-0 top-[35%] w-[80%] z-20"
            >
              <div className="glass p-3 rounded-2xl premium-shadow hover:shadow-lg transition-all duration-300">
                <img 
                  src="/lovable-uploads/3240ca9f-aebe-489a-9f37-cd30fac54e70.png" 
                  alt="Email Inbox Interface" 
                  className="w-full h-auto rounded-xl"
                  loading="lazy"
                />
              </div>
            </motion.div>

            {/* Background Elements */}
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -left-20 -top-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
