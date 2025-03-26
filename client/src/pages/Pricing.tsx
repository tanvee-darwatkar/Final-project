import { Check } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Pricing = () => {
  const pricingPlans = [
    {
      name: "Starter",
      price: "$29",
      description: "Perfect for individuals and small teams just getting started.",
      features: [
        "100 keyword searches/day",
        "Export up to 1,000 keywords",
        "Basic competitive analysis",
        "7-day search history"
      ],
      disabledFeatures: [
        "Advanced filters",
        "API access"
      ],
      isPopular: false
    },
    {
      name: "Professional",
      price: "$79",
      description: "For growing businesses with advanced keyword research needs.",
      features: [
        "500 keyword searches/day",
        "Export up to 10,000 keywords",
        "Advanced competitive analysis",
        "30-day search history",
        "Advanced filters"
      ],
      disabledFeatures: [
        "API access"
      ],
      isPopular: true
    },
    {
      name: "Enterprise",
      price: "$199",
      description: "For large teams and agencies with demanding requirements.",
      features: [
        "Unlimited keyword searches",
        "Unlimited keyword exports",
        "Premium competitive analysis",
        "90-day search history",
        "Advanced filters",
        "API access"
      ],
      disabledFeatures: [],
      isPopular: false
    }
  ];

  return (
    <main>
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Simple, Transparent Pricing</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose the plan that's right for your business. All plans include full access to our keyword research tools.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`${
                  plan.isPopular 
                    ? 'border-2 border-primary relative shadow-md' 
                    : 'border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white text-sm font-medium px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <CardHeader className="p-6 border-b border-gray-200">
                  <CardTitle className="text-xl font-bold text-gray-800 mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-primary">{plan.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="text-green-500 mr-2 mt-0.5 h-5 w-5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                    
                    {plan.disabledFeatures.map((feature, i) => (
                      <li key={i} className="flex items-start text-gray-400">
                        <span className="mr-2 mt-0.5">✕</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/#waitlist" className="block mt-6">
                    <Button 
                      className={`w-full ${
                        plan.isPopular 
                          ? 'bg-primary hover:bg-primary/90 text-white' 
                          : 'bg-white border border-primary text-primary hover:bg-blue-50'
                      }`}
                      variant={plan.isPopular ? 'default' : 'outline'}
                    >
                      Join Waitlist
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-16 max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Need a custom plan?</h2>
            <p className="text-gray-600 mb-6">
              We offer custom plans for agencies and enterprise customers with specific requirements. 
              Contact us to discuss your needs and get a personalized quote.
            </p>
            <Button variant="outline" className="bg-transparent">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Pricing;
