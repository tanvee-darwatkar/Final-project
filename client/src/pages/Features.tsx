import { Check, BarChart2, Search, DownloadCloud, FilterIcon, History, BarChart } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

const Features = () => {
  const featureList = [
    {
      icon: <Search className="h-8 w-8 text-primary" />,
      title: "Advanced Keyword Research",
      description: "Our tool crawls search engines to provide you with the most relevant keywords for your industry. Get comprehensive data on search volume, competition, and trends.",
      benefits: [
        "Discover long-tail keyword opportunities",
        "Find low-competition keywords",
        "See related keywords and questions",
        "Track search volume trends over time"
      ]
    },
    {
      icon: <BarChart2 className="h-8 w-8 text-primary" />,
      title: "Competitive Analysis",
      description: "Analyze your competitors' keyword strategies to find gaps and opportunities. See what keywords they rank for that you don't, and vice versa.",
      benefits: [
        "Compare keyword rankings with competitors",
        "Identify content gaps in your strategy",
        "Discover competitor keyword strategies",
        "Find untapped market opportunities"
      ]
    },
    {
      icon: <BarChart className="h-8 w-8 text-primary" />,
      title: "Data Visualization",
      description: "Understand your keyword data at a glance with intuitive charts and graphs. Monitor trends and make data-driven decisions for your content strategy.",
      benefits: [
        "Interactive charts for keyword metrics",
        "Visual comparison of keyword performance",
        "Trend analysis with historical data",
        "Custom dashboard for key metrics"
      ]
    },
    {
      icon: <DownloadCloud className="h-8 w-8 text-primary" />,
      title: "Export & Reporting",
      description: "Export your keyword data in multiple formats for further analysis or presentation. Create custom reports to share with your team or clients.",
      benefits: [
        "Export data in CSV, Excel, or PDF formats",
        "Schedule automated reports",
        "Custom report templates",
        "Data integration with other tools"
      ]
    },
    {
      icon: <History className="h-8 w-8 text-primary" />,
      title: "Search History",
      description: "Never lose track of your research. KeywordInsight saves your search history so you can easily pick up where you left off.",
      benefits: [
        "Access past keyword searches",
        "Track search history across projects",
        "Save favorite searches",
        "Resume research sessions"
      ]
    },
    {
      icon: <FilterIcon className="h-8 w-8 text-primary" />,
      title: "Advanced Filtering",
      description: "Narrow down your keyword results with powerful filtering options. Find exactly what you're looking for with custom parameters.",
      benefits: [
        "Filter by search volume, CPC, or competition",
        "Sort results by multiple metrics",
        "Exclude specific terms or phrases",
        "Create custom filter presets"
      ]
    }
  ];

  return (
    <main>
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Powerful Features for Keyword Research</h1>
            <p className="text-xl text-gray-600">
              Discover how KeywordInsight can transform your content strategy with these powerful tools and features.
            </p>
          </div>

          <div className="space-y-16">
            {featureList.map((feature, index) => (
              <div 
                key={index} 
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}
              >
                <div className="md:w-1/2">
                  <div className="bg-white p-10 rounded-lg shadow-lg">
                    <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                      {feature.icon}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h2>
                    <p className="text-gray-600 mb-6">{feature.description}</p>
                    <div className="space-y-2">
                      {feature.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2">
                  <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                    {/* This would be a feature image in a real implementation */}
                    <div className="text-gray-400 text-lg">Feature visualization</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Ready to transform your keyword research?</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/#waitlist">
                <Button className="bg-primary hover:bg-primary/90 text-lg py-6 px-8">
                  Join Waitlist
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" className="text-lg py-6 px-8">
                  Try Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Features;
