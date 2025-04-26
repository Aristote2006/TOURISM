
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const categories = [
  {
    name: "Hotels & Resorts",
    icon: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=600",
    count: 245,
  },
  {
    name: "Restaurants",
    icon: "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=600",
    count: 187,
  },
  {
    name: "Saloons & Spas",
    icon: "https://images.pexels.com/photos/3188/love-romantic-bath-candlelight.jpg?auto=compress&cs=tinysrgb&w=600",
    count: 113,
  },
  {
    name: "Lodges",
    icon: "https://images.pexels.com/photos/803975/pexels-photo-803975.jpeg?auto=compress&cs=tinysrgb&w=600",
    count: 92,
  },
  {
    name: "Adventure",
    icon: "https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=600",
    count: 156,
  },
];

const ActivityCategories = () => {
  return (
    <section className="py-16">
      <div className="container px-4">
        <h2 className="section-heading text-center mb-12">Browse by Category</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8">
          {categories.map((category, index) => (
            <Card
              key={category.name}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardContent className="p-0">
                <div className="relative group">
                  <img
                    src={category.icon}
                    alt={category.name}
                    loading="lazy"
                    className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      // Fallback image if the original fails to load
                      e.currentTarget.src = "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=600";
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-4 text-center">
                    <h3 className="font-display font-medium text-lg mb-1">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.count} listings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActivityCategories;
