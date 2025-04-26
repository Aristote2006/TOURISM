
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '@/components/home/Hero';
import FeaturedActivities from '@/components/home/FeaturedActivities';
import ActivityCategories from '@/components/home/ActivityCategories';
import ActivityFilter from '@/components/home/ActivityFilter';
import ActivityCard from '@/components/home/ActivityCard';
import { Button } from '@/components/ui/button';
import { useActivities } from '@/contexts/ActivityContext';

const HomePage = () => {
  const { activities } = useActivities();
  const [filteredActivities, setFilteredActivities] = useState(activities);

  // Update filtered activities when activities change
  useEffect(() => {
    setFilteredActivities(activities);
  }, [activities]);

  const handleFilterChange = (type: string, location: string, search: string) => {
    const filtered = activities.filter((activity) => {
      const typeMatch = type === 'all' || activity.type.toLowerCase() === type.toLowerCase();
      const locationMatch = location === 'all' || activity.location.toLowerCase() === location.toLowerCase();
      const searchMatch = activity.name.toLowerCase().includes(search.toLowerCase()) ||
                          activity.description.toLowerCase().includes(search.toLowerCase());

      return typeMatch && locationMatch && searchMatch;
    });

    setFilteredActivities(filtered);
  };

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
            <Link to="/about" className="text-white hover:text-white/80 font-medium transition-colors px-2 py-1 rounded hover:bg-white/10">About</Link>
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

      {/* Hero Section */}
      <Hero />

      {/* Featured Activities */}
      <FeaturedActivities />

      {/* Categories */}
      <ActivityCategories />

      {/* Browse All Activities */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4">
          <h2 className="section-heading text-center mb-12">Browse All Activities</h2>

          <ActivityFilter onFilterChange={handleFilterChange} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <div key={activity.id} className="animate-fade-in">
                  <ActivityCard activity={activity} />
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No activities found matching your search criteria.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => handleFilterChange('all', 'all', '')}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

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
                <li><Link to="/" className="text-gray-300 hover:text-white">Hotels & Resorts</Link></li>
                <li><Link to="/" className="text-gray-300 hover:text-white">Restaurants</Link></li>
                <li><Link to="/" className="text-gray-300 hover:text-white">Saloons & Spas</Link></li>
                <li><Link to="/" className="text-gray-300 hover:text-white">Lodges</Link></li>
                <li><Link to="/" className="text-gray-300 hover:text-white">Adventure</Link></li>
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

export default HomePage;
