import { BarChart2, Search, DownloadCloud, FilterIcon, History, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import WaitlistForm from '@/components/WaitlistForm';
import FAQ from '@/components/FAQ';

const Home = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-[#f9fafb] bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%233366ff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                Discover High-Value <span className="text-primary">Keywords</span> for Your Business
              </h1>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Get actionable keyword insights based on real search data. Optimize your content strategy with our powerful research platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#waitlist">
                  <Button className="bg-primary hover:bg-primary/90 text-white py-6 px-6 text-lg">
                    Join Waitlist
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button variant="outline" className="py-6 px-6 text-lg">
                    Try Demo
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-12">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=700&q=80" 
                alt="Analytics dashboard with keyword data" 
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Powerful Features</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to optimize your content strategy and discover valuable keywords
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-100 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Search className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Advanced Keyword Research</h3>
              <p className="text-gray-700">
                Discover thousands of relevant keywords with accurate search volumes and competition metrics.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-100 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <BarChart2 className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Competitive Analysis</h3>
              <p className="text-gray-700">
                Analyze your competitors' top keywords and identify gaps in your content strategy.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-100 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <BarChart className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Data Visualization</h3>
              <p className="text-gray-700">
                Interactive charts and graphs to visualize keyword trends and performance metrics.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-gray-100 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <DownloadCloud className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Export & Reporting</h3>
              <p className="text-gray-700">
                Export your keyword data in multiple formats and create custom reports for your team.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-gray-100 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <History className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Search History</h3>
              <p className="text-gray-700">
                Keep track of your previous searches and access them quickly for continued research.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-gray-100 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FilterIcon className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Advanced Filtering</h3>
              <p className="text-gray-700">
                Filter and sort your keyword results by multiple metrics to find exactly what you need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about KeywordInsight
            </p>
          </div>
          
          <FAQ />
        </div>
      </section>
      
      {/* Waitlist Section */}
      <section id="waitlist" className="py-16 bg-primary bg-opacity-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Join the Waitlist</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Be the first to get access when we launch. Enter your email below and we'll notify you when KeywordInsight is ready.
            </p>
          </div>
          
          <div className="max-w-xl mx-auto">
            <WaitlistForm />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
