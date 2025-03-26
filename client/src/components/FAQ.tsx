import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "How accurate is your keyword data?",
    answer: "Our keyword data is sourced from multiple APIs and updated monthly for accuracy. We combine data from search engines, paid advertising platforms, and industry databases to provide the most comprehensive view possible."
  },
  {
    question: "When will KeywordInsight be available?",
    answer: "We're currently in private beta and plan to launch publicly in Q1 2023. Join our waitlist to be notified when we launch and to get early access to our platform."
  },
  {
    question: "Can I export data to other tools?",
    answer: "Yes! You can export your keyword data in multiple formats, including CSV, Excel, and PDF. We also offer API access for Enterprise customers to integrate directly with your existing tools and workflows."
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 14-day money-back guarantee for all new subscriptions. If you're not satisfied with our service, contact our support team within 14 days of your purchase for a full refund."
  },
  {
    question: "How does the waitlist work?",
    answer: "When you join our waitlist, you'll receive updates about our launch timeline and product features. We'll invite people from the waitlist in order of signup, with priority access for those who refer friends."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {faqItems.map((item, index) => (
        <div key={index} className="mb-6 bg-white rounded-lg shadow-sm">
          <button
            className="flex justify-between items-center w-full p-6 text-left"
            onClick={() => toggleFaq(index)}
          >
            <h3 className="text-lg font-medium text-gray-800">{item.question}</h3>
            {openIndex === index ? (
              <ChevronUp className="text-primary h-5 w-5" />
            ) : (
              <ChevronDown className="text-primary h-5 w-5" />
            )}
          </button>
          {openIndex === index && (
            <div className="p-6 pt-0">
              <p className="text-gray-700">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQ;
