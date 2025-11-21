
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-8">
            <Info className="h-8 w-8 text-farm-green mr-3" />
            <h1 className="text-4xl font-bold text-farm-green-dark">About Us</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-farm-green-dark">Our Story</h2>
              <p className="text-lg text-gray-700">
                AgroConnect started as an idea to solve a long-standing problem faced by farmers: limited market access and dependency on intermediaries. 
                What began as a small initiative in 2025 has grown into a digital platform that directly connects farmers with consumers, ensuring fair pricing, transparency, and trust.
              </p>
              <p className="text-lg text-gray-700">
                We collaborate with a network of local farmers and buyers who share our vision of sustainable agriculture, digital empowerment, and ethical trade. 
                Every feature of our platform is designed to support farmers and provide consumers with fresh, high-quality produce.
              </p>
              
              <h3 className="text-2xl font-semibold text-farm-green-dark mt-8">Our Mission</h3>
              <p className="text-lg text-gray-700">
                Our mission is to empower farmers by giving them direct access to markets, fair compensation for their hard work, and the tools to succeed in the digital economy. 
                At the same time, we aim to provide consumers with fresh, affordable produce through a transparent and secure system.
              </p>
              <p className="text-lg text-gray-700">
                AgroConnect believes that technology can bridge the gap between producers and buyers while promoting sustainability, fairness, and trust in the agricultural ecosystem.
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=80" 
                  alt="Our Farm" 
                  className="w-full h-auto"
                />
              </div>
              
              <div className="bg-muted rounded-2xl p-8">
                <h3 className="text-2xl font-semibold text-farm-green-dark mb-4">Our Values</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-farm-green/10 flex items-center justify-center mr-3 mt-1">
                      <div className="h-3 w-3 bg-farm-green rounded-full"></div>
                    </div>
                    <span className="text-gray-700"><span className="font-semibold">Digital Empowerment:</span> We provide farmers with digital tools and direct market access to succeed in the modern economy.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-farm-green/10 flex items-center justify-center mr-3 mt-1">
                      <div className="h-3 w-3 bg-farm-green rounded-full"></div>
                    </div>
                    <span className="text-gray-700"><span className="font-semibold">Fair Trade:</span> We ensure farmers receive fair compensation by eliminating intermediaries and promoting direct trade.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-farm-green/10 flex items-center justify-center mr-3 mt-1">
                      <div className="h-3 w-3 bg-farm-green rounded-full"></div>
                    </div>
                    <span className="text-gray-700"><span className="font-semibold">Transparency:</span> We provide complete visibility into pricing, farming practices, and the journey from farm to table.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-farm-green/10 flex items-center justify-center mr-3 mt-1">
                      <div className="h-3 w-3 bg-farm-green rounded-full"></div>
                    </div>
                    <span className="text-gray-700"><span className="font-semibold">Sustainability:</span> We promote sustainable agriculture and ethical trade practices that benefit both farmers and consumers.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-farm-green/5 rounded-2xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-farm-green-dark mb-6 text-center">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="text-center group cursor-pointer">
                <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4 ring-4 ring-transparent transition-all duration-300 group-hover:ring-farm-green group-hover:scale-110 group-hover:shadow-2xl">
                  <img 
                    src="/Priyanshu.jpg" 
                    alt="Priyanshu" 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-xl font-semibold text-farm-green-dark transition-colors duration-300 group-hover:text-farm-green">Priyanshu</h3>
                <p className="text-gray-600 transition-all duration-300 group-hover:text-farm-green-dark group-hover:font-medium">Co-Founder & Developer</p>
              </div>
              
              <div className="text-center group cursor-pointer">
                <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4 ring-4 ring-transparent transition-all duration-300 group-hover:ring-farm-green group-hover:scale-110 group-hover:shadow-2xl">
                  <img 
                    src="/Saksham.jpg" 
                    alt="Saksham" 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-xl font-semibold text-farm-green-dark transition-colors duration-300 group-hover:text-farm-green">Saksham</h3>
                <p className="text-gray-600 transition-all duration-300 group-hover:text-farm-green-dark group-hover:font-medium">Co-Founder & Developer</p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Button 
              className="bg-farm-green hover:bg-farm-green-dark text-white rounded-full px-8 py-6"
              onClick={() => window.location.href = '/contact'}
            >
              Get In Touch With Us
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
