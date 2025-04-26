
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "Discover Amazing Places",
    subtitle: "Find the perfect destination for your next adventure"
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "Unforgettable Experiences",
    subtitle: "Create memories that last a lifetime"
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "Culinary Delights",
    subtitle: "Taste the flavors of the world"
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-section">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
            onError={(e) => {
              // Fallback if image fails to load
              const target = e.target as HTMLDivElement;
              target.style.backgroundImage = `url(https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)`;
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>

          <div className="relative h-full flex flex-col items-center justify-center text-white text-center px-4">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 animate-fade-in">
              {slide.title}
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mb-8 animate-slide-up">
              {slide.subtitle}
            </p>

            <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md rounded-xl p-4 animate-fade-in">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-grow">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search activities, locations..."
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-white text-foreground"
                    />
                  </div>
                </div>
                <div className="w-full md:w-auto flex gap-2">
                  <Button size="lg" className="w-full bg-tourism-yellow text-black hover:bg-tourism-yellow/90">
                    Explore Now
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex justify-center">
                <a href="/admin" className="text-white hover:text-primary-foreground transition-colors">
                  <span className="flex items-center gap-1 text-sm font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M9 14v1" />
                      <path d="M9 8v1" />
                      <path d="M15 14v1" />
                      <path d="M15 8v1" />
                      <path d="M9 12h6" />
                    </svg>
                    Access Admin Dashboard
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-white scale-125" : "bg-white/50"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
