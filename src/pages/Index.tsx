
import { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { EmailGenerator } from '../components/EmailGenerator';
import { Inbox } from '../components/Inbox';
import { AboutSection } from '../components/AboutSection';
import { Testimonials } from '../components/Testimonials';
import { Footer } from '../components/Footer';
import { Toaster } from 'sonner';
import { Shield, Lock, Mail, Clock } from 'lucide-react';

const Index = () => {
  const [currentEmail, setCurrentEmail] = useState('');
  const features = [{
    icon: Shield,
    title: "Anonymous Protection",
    description: "Generate burner emails for ultimate online privacy"
  }, {
    icon: Lock,
    title: "Secure & Private",
    description: "Create disposable temporary email addresses with no registration"
  }, {
    icon: Mail,
    title: "Social Media Ready",
    description: "Perfect temporary mail for Facebook verification and sign-ups"
  }, {
    icon: Clock,
    title: "Auto-Expiring",
    description: "Your throwaway mail automatically deletes after use"
  }];

  return <div className="min-h-screen bg-gradient-to-b from-white to-accent/20">
      <Toaster position="top-center" />
      <Navigation />

      {/* Hero Section */}
      <header className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Best Disposable Email Service
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Create instant throwaway mail addresses for Facebook, online registrations, and more. 
            Our disposable email IDs keep your real inbox clean and secure.
          </p>
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
            Why Choose Our Disposable Email Service?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => <article key={index} className="p-6 rounded-xl bg-accent/10 hover:bg-accent/20 transition-colors">
                <feature.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </article>)}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-accent/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Benefits of Our Temporary Email Service
          </h2>
          <div className="max-w-3xl mx-auto prose lg:prose-lg">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none">
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Perfect for Facebook account verification</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Create unlimited disposable email IDs</span>
              </li>
              <li className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Best throwaway mail service for privacy</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Temporary addresses that auto-expire</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <AboutSection />
      <Testimonials />
      <Footer />
    </div>;
};

export default Index;
