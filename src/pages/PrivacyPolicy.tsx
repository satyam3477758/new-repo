import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-farm-green-light/20 to-white py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-farm-green/10 flex items-center justify-center">
                <Shield className="h-8 w-8 text-farm-green" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-center text-farm-green-dark mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-center text-gray-600 max-w-2xl mx-auto">
              Your privacy and data security are our top priorities
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl font-bold text-farm-green-dark mb-4">Information We Collect</h2>
                <div className="prose prose-lg text-gray-600">
                  <p>We collect information that you provide directly to us, including:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Name, email address, phone number, and delivery address</li>
                    <li>Payment information (processed securely through our payment partners)</li>
                    <li>Order history and preferences</li>
                    <li>Communication preferences</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-farm-green-dark mb-4">How We Use Your Information</h2>
                <div className="prose prose-lg text-gray-600">
                  <p>We use the information we collect to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Process and fulfill your orders</li>
                    <li>Communicate with you about your orders and account</li>
                    <li>Send you marketing communications (with your consent)</li>
                    <li>Improve our services and customer experience</li>
                    <li>Prevent fraud and ensure security</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-farm-green-dark mb-4">Data Security</h2>
                <div className="prose prose-lg text-gray-600">
                  <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
                  <p>All payment information is encrypted and processed through secure payment gateways. We never store your complete payment card details.</p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-farm-green-dark mb-4">Sharing Your Information</h2>
                <div className="prose prose-lg text-gray-600">
                  <p>We do not sell or rent your personal information to third parties. We may share your information with:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Delivery partners to fulfill your orders</li>
                    <li>Payment processors to handle transactions</li>
                    <li>Service providers who assist in our operations</li>
                    <li>Law enforcement when required by law</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-farm-green-dark mb-4">Your Rights</h2>
                <div className="prose prose-lg text-gray-600">
                  <p>You have the right to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access and update your personal information</li>
                    <li>Request deletion of your account and data</li>
                    <li>Opt-out of marketing communications</li>
                    <li>Request a copy of your data</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-farm-green-dark mb-4">Cookies</h2>
                <div className="prose prose-lg text-gray-600">
                  <p>We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings.</p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-farm-green-dark mb-4">Updates to This Policy</h2>
                <div className="prose prose-lg text-gray-600">
                  <p>We may update this privacy policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last Updated" date.</p>
                  <p className="font-semibold">Last Updated: November 21, 2025</p>
                </div>
              </div>

              {/* Contact */}
              <div className="p-8 bg-farm-green/5 rounded-lg">
                <h3 className="text-xl font-bold text-farm-green-dark mb-4">
                  Questions about privacy?
                </h3>
                <p className="text-gray-600 mb-4">
                  If you have any questions about our privacy policy, please contact us.
                </p>
                <a 
                  href="/contact"
                  className="inline-block bg-farm-green hover:bg-farm-green-dark text-white px-8 py-3 rounded-full font-semibold transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
