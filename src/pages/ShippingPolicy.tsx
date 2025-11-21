import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Truck, Clock, MapPin, Package } from 'lucide-react';

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-farm-green-light/20 to-white py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-farm-green/10 flex items-center justify-center">
                <Truck className="h-8 w-8 text-farm-green" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-center text-farm-green-dark mb-4">
              Shipping Policy
            </h1>
            <p className="text-xl text-center text-gray-600 max-w-2xl mx-auto">
              Fast, reliable delivery of fresh produce to your doorstep
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-12">
              {/* Delivery Options */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Package className="h-6 w-6 text-farm-green" />
                  <h2 className="text-2xl font-bold text-farm-green-dark">Delivery Options</h2>
                </div>
                <div className="space-y-4 text-gray-600">
                  <div className="p-6 bg-white rounded-lg shadow-sm border">
                    <h3 className="font-semibold text-farm-green-dark mb-2">Standard Delivery (2-3 Business Days)</h3>
                    <p>Free for orders above ₹500. ₹50 delivery charge for orders below ₹500.</p>
                  </div>
                  <div className="p-6 bg-white rounded-lg shadow-sm border">
                    <h3 className="font-semibold text-farm-green-dark mb-2">Express Delivery (Next Day)</h3>
                    <p>Available in select areas. ₹100 delivery charge. Order before 2 PM for next-day delivery.</p>
                  </div>
                </div>
              </div>

              {/* Delivery Areas */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="h-6 w-6 text-farm-green" />
                  <h2 className="text-2xl font-bold text-farm-green-dark">Delivery Areas</h2>
                </div>
                <div className="prose prose-lg text-gray-600">
                  <p>We currently deliver to most major cities and towns across India. Enter your pincode at checkout to verify if we deliver to your area.</p>
                  <p>We're constantly expanding our delivery network to reach more customers.</p>
                </div>
              </div>

              {/* Processing Time */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-6 w-6 text-farm-green" />
                  <h2 className="text-2xl font-bold text-farm-green-dark">Order Processing</h2>
                </div>
                <div className="prose prose-lg text-gray-600">
                  <p>Orders are processed within 24 hours of placement. You'll receive a confirmation email once your order is shipped with tracking details.</p>
                  <p>Orders placed on weekends or holidays will be processed on the next business day.</p>
                </div>
              </div>

              {/* Packaging */}
              <div>
                <h2 className="text-2xl font-bold text-farm-green-dark mb-4">Packaging</h2>
                <div className="prose prose-lg text-gray-600">
                  <p>All products are carefully packaged to ensure freshness during transit. We use eco-friendly, recyclable packaging materials to minimize environmental impact.</p>
                  <p>Temperature-sensitive items are packed with ice packs to maintain optimal freshness.</p>
                </div>
              </div>

              {/* Tracking */}
              <div>
                <h2 className="text-2xl font-bold text-farm-green-dark mb-4">Order Tracking</h2>
                <div className="prose prose-lg text-gray-600">
                  <p>Once your order is shipped, you'll receive a tracking number via email and SMS. You can track your order in real-time from your account dashboard.</p>
                </div>
              </div>

              {/* Contact */}
              <div className="p-8 bg-farm-green/5 rounded-lg">
                <h3 className="text-xl font-bold text-farm-green-dark mb-4">
                  Questions about shipping?
                </h3>
                <p className="text-gray-600 mb-4">
                  Contact our customer support team for assistance with your delivery.
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

export default ShippingPolicy;
