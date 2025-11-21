import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { RotateCcw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const ReturnPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-farm-green-light/20 to-white py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-farm-green/10 flex items-center justify-center">
                <RotateCcw className="h-8 w-8 text-farm-green" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-center text-farm-green-dark mb-4">
              Return & Refund Policy
            </h1>
            <p className="text-xl text-center text-gray-600 max-w-2xl mx-auto">
              Your satisfaction is our priority
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-12">
              {/* Return Window */}
              <div>
                <h2 className="text-2xl font-bold text-farm-green-dark mb-4">Return Window</h2>
                <div className="prose prose-lg text-gray-600">
                  <p>We offer a 7-day return policy from the date of delivery. If you're not completely satisfied with your purchase, you can return it for a full refund or exchange.</p>
                </div>
              </div>

              {/* Eligible Items */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-farm-green-dark">Eligible for Return</h2>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <span>Products that are damaged or defective upon delivery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <span>Wrong items delivered</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <span>Products not meeting quality standards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <span>Unopened packaged products in original condition</span>
                  </li>
                </ul>
              </div>

              {/* Non-Eligible Items */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <XCircle className="h-6 w-6 text-red-600" />
                  <h2 className="text-2xl font-bold text-farm-green-dark">Not Eligible for Return</h2>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                    <span>Perishable items that have been opened or consumed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                    <span>Products damaged due to misuse or negligence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                    <span>Items returned after 7 days of delivery</span>
                  </li>
                </ul>
              </div>

              {/* Return Process */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="h-6 w-6 text-farm-green" />
                  <h2 className="text-2xl font-bold text-farm-green-dark">How to Return</h2>
                </div>
                <div className="space-y-4">
                  <div className="p-6 bg-white rounded-lg shadow-sm border">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-farm-green text-white flex items-center justify-center font-bold">1</div>
                      <h3 className="font-semibold text-farm-green-dark">Contact Us</h3>
                    </div>
                    <p className="text-gray-600 ml-11">Email us at mishrapriyanshu1975@gmail.com or call +91 831847644 within 7 days of delivery.</p>
                  </div>
                  <div className="p-6 bg-white rounded-lg shadow-sm border">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-farm-green text-white flex items-center justify-center font-bold">2</div>
                      <h3 className="font-semibold text-farm-green-dark">Get Approval</h3>
                    </div>
                    <p className="text-gray-600 ml-11">Our team will review your request and provide return instructions if approved.</p>
                  </div>
                  <div className="p-6 bg-white rounded-lg shadow-sm border">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-farm-green text-white flex items-center justify-center font-bold">3</div>
                      <h3 className="font-semibold text-farm-green-dark">Ship the Item</h3>
                    </div>
                    <p className="text-gray-600 ml-11">Pack the item securely and ship it back to us using the provided return label.</p>
                  </div>
                  <div className="p-6 bg-white rounded-lg shadow-sm border">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-farm-green text-white flex items-center justify-center font-bold">4</div>
                      <h3 className="font-semibold text-farm-green-dark">Receive Refund</h3>
                    </div>
                    <p className="text-gray-600 ml-11">Once we receive and inspect the item, your refund will be processed within 5-7 business days.</p>
                  </div>
                </div>
              </div>

              {/* Refund Method */}
              <div>
                <h2 className="text-2xl font-bold text-farm-green-dark mb-4">Refund Method</h2>
                <div className="prose prose-lg text-gray-600">
                  <p>Refunds will be credited to your original payment method. For cash on delivery orders, refunds will be processed via bank transfer.</p>
                </div>
              </div>

              {/* Contact */}
              <div className="p-8 bg-farm-green/5 rounded-lg">
                <h3 className="text-xl font-bold text-farm-green-dark mb-4">
                  Need help with a return?
                </h3>
                <p className="text-gray-600 mb-4">
                  Our customer support team is here to assist you with the return process.
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

export default ReturnPolicy;
