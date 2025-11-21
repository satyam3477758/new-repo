import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from 'lucide-react';

const FAQs = () => {
  const faqs = [
    {
      question: "How do I place an order?",
      answer: "Simply browse our products, add items to your cart, and proceed to checkout. You'll need to create an account or log in to complete your purchase."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and UPI payments."
    },
    {
      question: "How long does delivery take?",
      answer: "Standard delivery takes 2-3 business days. Express delivery is available for next-day delivery in select areas."
    },
    {
      question: "Are your products organic?",
      answer: "Yes, all our products are 100% organic and sourced directly from certified organic farms."
    },
    {
      question: "Can I track my order?",
      answer: "Yes, once your order is shipped, you'll receive a tracking number via email. You can also track your order from the 'Order History' section in your account."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 7-day return policy for all products. If you're not satisfied with your purchase, you can return it for a full refund or exchange."
    },
    {
      question: "Do you deliver to my area?",
      answer: "We currently deliver to most major cities and towns. Enter your pincode at checkout to check if we deliver to your area."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach us via email at mishrapriyanshu1975@gmail.com or call us at +91 831847644 during business hours (Mon-Fri: 9am-6pm)."
    },
    {
      question: "Can I modify or cancel my order?",
      answer: "You can modify or cancel your order within 2 hours of placing it. After that, the order is processed and cannot be changed."
    },
    {
      question: "Do you offer bulk discounts?",
      answer: "Yes, we offer special pricing for bulk orders. Please contact our sales team for more information."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-farm-green-light/20 to-white py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-farm-green/10 flex items-center justify-center">
                <HelpCircle className="h-8 w-8 text-farm-green" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-center text-farm-green-dark mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-center text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about AgroConnect
            </p>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6 bg-white shadow-sm">
                  <AccordionTrigger className="text-left font-semibold text-farm-green-dark hover:text-farm-green">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Contact Section */}
            <div className="mt-16 p-8 bg-farm-green/5 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-farm-green-dark mb-4">
                Still have questions?
              </h3>
              <p className="text-gray-600 mb-6">
                Can't find the answer you're looking for? Please contact our customer support team.
              </p>
              <a 
                href="/contact"
                className="inline-block bg-farm-green hover:bg-farm-green-dark text-white px-8 py-3 rounded-full font-semibold transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FAQs;
