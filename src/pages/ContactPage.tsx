import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const ContactPage = () => {
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
            <Link to="/contact" className="text-white hover:text-white/80 font-medium transition-colors px-2 py-1 rounded hover:bg-white/10 bg-white/20">Contact</Link>
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
          <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
          
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
                      <Input id="name" placeholder="Enter your name" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                      <Input id="email" type="email" placeholder="Enter your email" />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                    <Input id="subject" placeholder="What is this regarding?" />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                    <Textarea id="message" placeholder="Your message" className="min-h-[150px]" />
                  </div>
                  
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Send Message
                  </Button>
                </form>
              </div>
              
              {/* Contact Information */}
              <div>
                <div className="bg-primary/10 p-8 rounded-lg mb-8">
                  <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <MapPin className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Address</h3>
                        <p className="text-gray-600">Tourism Street, Musanze, KM 509 ST</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <Phone className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Phone</h3>
                        <p className="text-gray-600">+250 784 227 283</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <Mail className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <p className="text-gray-600">cavakenneth58@gmail.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <Clock className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Business Hours</h3>
                        <p className="text-gray-600">Monday - Friday: 9:00 AM - 5:00 PM</p>
                        <p className="text-gray-600">Saturday: 10:00 AM - 2:00 PM</p>
                        <p className="text-gray-600">Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold mb-6">Our Location</h2>
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63799.41051610982!2d29.5834646!3d-1.4977639!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dc4b1232777dc1%3A0x5a4d50f5a57fbd53!2sMusanze%2C%20Rwanda!5e0!3m2!1sen!2sus!4v1653644725175!5m2!1sen!2sus" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
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

export default ContactPage;
