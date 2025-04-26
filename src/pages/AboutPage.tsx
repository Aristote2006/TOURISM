import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-primary/90 to-primary sticky top-0 z-20 shadow-md">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 22V12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 12L22 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 12L2 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-xl font-display font-bold text-white">TourismApp</span>
            </Link>
            
            <button className="sm:hidden text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-6">
            <Link to="/" className="text-white hover:text-white/80 font-medium transition-colors px-2 py-1 rounded hover:bg-white/10">Home</Link>
            <Link to="/about" className="text-white hover:text-white/80 font-medium transition-colors px-2 py-1 rounded hover:bg-white/10 bg-white/20">About</Link>
            <Link to="/activities" className="text-white hover:text-white/80 font-medium transition-colors px-2 py-1 rounded hover:bg-white/10">Activities</Link>
            <Link to="/contact" className="text-white hover:text-white/80 font-medium transition-colors px-2 py-1 rounded hover:bg-white/10">Contact</Link>
            <Link to="/auth">
              <Button className="bg-white text-primary hover:bg-white/90 font-medium">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="py-16 flex-grow">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-center">About TourismApp</h1>
            
            <div className="mb-12">
              <img 
                src="https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Tourism landscape" 
                className="w-full h-80 object-cover rounded-lg mb-8"
              />
              
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-lg mb-6 text-gray-700">
                At TourismApp, our mission is to connect travelers with exceptional experiences and local businesses. 
                We believe that travel should be transformative, enriching, and accessible to everyone.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
              <p className="text-lg mb-6 text-gray-700">
                Founded in 2023, TourismApp is a platform dedicated to showcasing the best tourism activities, 
                accommodations, and dining experiences. We work closely with local businesses to highlight 
                authentic experiences that represent the true spirit of each destination.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-muted/30 p-6 rounded-lg">
                  <h3 className="text-xl font-medium mb-2">For Travelers</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Curated selection of quality experiences</li>
                    <li>Detailed information about activities</li>
                    <li>Easy discovery of local attractions</li>
                    <li>Authentic travel experiences</li>
                  </ul>
                </div>
                
                <div className="bg-muted/30 p-6 rounded-lg">
                  <h3 className="text-xl font-medium mb-2">For Businesses</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Increased visibility to potential customers</li>
                    <li>Simple platform to showcase offerings</li>
                    <li>Connection with interested travelers</li>
                    <li>Support for local tourism economy</li>
                  </ul>
                </div>
              </div>
              
              <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
              <p className="text-lg mb-6 text-gray-700">
                We believe in sustainable tourism that benefits local communities while providing 
                authentic experiences for travelers. Our platform prioritizes:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-lg mb-8 text-gray-700">
                <li><strong>Authenticity</strong> - Showcasing genuine local experiences</li>
                <li><strong>Sustainability</strong> - Promoting responsible tourism practices</li>
                <li><strong>Community</strong> - Supporting local businesses and economies</li>
                <li><strong>Quality</strong> - Curating exceptional experiences for travelers</li>
              </ul>
              
              <div className="bg-primary/10 p-8 rounded-lg text-center">
                <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
                <p className="text-lg mb-6">
                  Whether you're a traveler seeking new adventures or a business looking to connect with customers,
                  TourismApp is here to help you discover and share amazing experiences.
                </p>
                <div className="flex justify-center gap-4">
                  <Link to="/activities">
                    <Button className="bg-primary hover:bg-primary/90">
                      Explore Activities
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button variant="outline">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About TourismApp</h3>
              <p className="text-gray-300">
                Discover and explore amazing activities and destinations around the world.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
                <li><Link to="/about" className="text-gray-300 hover:text-white">About</Link></li>
                <li><Link to="/activities" className="text-gray-300 hover:text-white">Activities</Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
                <li><Link to="/auth" className="text-gray-300 hover:text-white font-medium">Login</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <ul className="space-y-2">
                <li><Link to="/activities" className="text-gray-300 hover:text-white">Hotels & Resorts</Link></li>
                <li><Link to="/activities" className="text-gray-300 hover:text-white">Restaurants</Link></li>
                <li><Link to="/activities" className="text-gray-300 hover:text-white">Saloons & Spas</Link></li>
                <li><Link to="/activities" className="text-gray-300 hover:text-white">Lodges</Link></li>
                <li><Link to="/activities" className="text-gray-300 hover:text-white">Adventure</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <address className="not-italic text-gray-300">
                <p>Tourism Street</p>
                <p>Musanze, KM 509 ST</p>
                <p className="mt-2">Email: cavakenneth58@gmail.com</p>
                <p>Phone: +250 784 227 283</p>
              </address>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} TourismApp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
