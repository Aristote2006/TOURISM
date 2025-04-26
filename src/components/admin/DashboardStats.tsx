
import React, { useState, useEffect } from 'react';
import { MapPin, Hotel, Utensils, Home, Mountain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useActivities } from '@/contexts/ActivityContext';

const stats = [
  {
    title: "Total Activities",
    value: "793",
    icon: <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-white" />,
    change: "+12% from last month",
    positive: true,
    color: "var(--color-activities)",
    bgClass: "bg-[hsl(var(--color-activities))]",
    path: "/admin/activities"
  },
  {
    title: "Hotels & Resorts",
    value: "245",
    icon: <Hotel className="h-6 w-6 sm:h-8 sm:w-8 text-white" />,
    change: "+5% from last month",
    positive: true,
    color: "var(--color-hotels)",
    bgClass: "bg-[hsl(var(--color-hotels))]",
    path: "/admin/activities"
  },
  {
    title: "Restaurants",
    value: "187",
    icon: <Utensils className="h-6 w-6 sm:h-8 sm:w-8 text-white" />,
    change: "+8% from last month",
    positive: true,
    color: "var(--color-restaurants)",
    bgClass: "bg-[hsl(var(--color-restaurants))]",
    path: "/admin/activities"
  },
  {
    title: "Lodges",
    value: "92",
    icon: <Home className="h-6 w-6 sm:h-8 sm:w-8 text-white" />,
    change: "-3% from last month",
    positive: false,
    color: "var(--color-lodges)",
    bgClass: "bg-[hsl(var(--color-lodges))]",
    path: "/admin/activities"
  },
  {
    title: "Adventures",
    value: "156",
    icon: <Mountain className="h-6 w-6 sm:h-8 sm:w-8 text-white" />,
    change: "+15% from last month",
    positive: true,
    color: "var(--color-adventures)",
    bgClass: "bg-[hsl(var(--color-adventures))]",
    path: "/admin/activities"
  },
];

const DashboardStats = () => {
  const navigate = useNavigate();
  const { activities } = useActivities();
  const [animatedStats, setAnimatedStats] = useState<{ [key: string]: number }>({});
  const [isVisible, setIsVisible] = useState(false);
  const [realStats, setRealStats] = useState<typeof stats>([]);

  useEffect(() => {
    // Calculate real stats based on activities
    const totalActivities = activities.length;
    const hotelCount = activities.filter(a => a.type.toLowerCase() === 'hotel').length;
    const restaurantCount = activities.filter(a => a.type.toLowerCase() === 'restaurant').length;
    const lodgeCount = activities.filter(a => a.type.toLowerCase() === 'lodge').length;
    const adventureCount = activities.filter(a => a.type.toLowerCase() === 'adventure').length;

    const updatedStats = [
      {
        ...stats[0],
        value: totalActivities.toString(),
        change: totalActivities > 0 ? "New activities added" : "No activities yet",
        positive: totalActivities > 0
      },
      {
        ...stats[1],
        value: hotelCount.toString(),
        change: hotelCount > 0 ? `${hotelCount} hotels & resorts` : "No hotels yet",
        positive: hotelCount > 0
      },
      {
        ...stats[2],
        value: restaurantCount.toString(),
        change: restaurantCount > 0 ? `${restaurantCount} restaurants` : "No restaurants yet",
        positive: restaurantCount > 0
      },
      {
        ...stats[3],
        value: lodgeCount.toString(),
        change: lodgeCount > 0 ? `${lodgeCount} lodges` : "No lodges yet",
        positive: lodgeCount > 0
      },
      {
        ...stats[4],
        value: adventureCount.toString(),
        change: adventureCount > 0 ? `${adventureCount} adventures` : "No adventures yet",
        positive: adventureCount > 0
      }
    ];

    setRealStats(updatedStats);

    // Start with zero values
    const initialValues = updatedStats.reduce((acc, stat) => {
      acc[stat.title] = 0;
      return acc;
    }, {} as { [key: string]: number });

    setAnimatedStats(initialValues);

    // Set visible after a small delay to trigger animations
    setTimeout(() => setIsVisible(true), 100);

    // Animate the numbers
    const interval = setInterval(() => {
      setAnimatedStats(prev => {
        const newValues = { ...prev };
        let allDone = true;

        updatedStats.forEach(stat => {
          const targetValue = parseInt(stat.value);
          const currentValue = prev[stat.title] || 0;

          if (currentValue < targetValue) {
            // Calculate increment - faster for larger numbers
            const increment = Math.max(1, Math.floor(targetValue / 20));
            newValues[stat.title] = Math.min(currentValue + increment, targetValue);
            allDone = false;
          }
        });

        if (allDone) {
          clearInterval(interval);
        }

        return newValues;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [activities]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
      {realStats.length > 0 ? realStats.map((stat, index) => (
        <div
          key={index}
          className={`stat-card overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer ${
            isVisible ? 'animate-fade-in' : 'opacity-0'
          }`}
          style={{ animationDelay: `${index * 100}ms` }}
          onClick={() => navigate(stat.path)}
        >
          <div className="flex flex-col h-full">
            <div className={`${stat.bgClass} p-2 sm:p-3 text-white`}>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium truncate">{stat.title}</p>
                <div className="rounded-full p-1.5 bg-white/20 animate-pulse">{stat.icon}</div>
              </div>
            </div>
            <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between bg-white dark:bg-gray-800">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold transition-all duration-300">
                {animatedStats[stat.title] || 0}
              </h3>
              <p className={`text-xs sm:text-sm mt-2 ${stat.positive ? 'text-green-600' : 'text-red-600'} font-medium`}>
                {stat.change}
              </p>
            </div>
          </div>
        </div>
      )) : stats.map((stat, index) => (
        <div
          key={index}
          className={`stat-card overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer ${
            isVisible ? 'animate-fade-in' : 'opacity-0'
          }`}
          style={{ animationDelay: `${index * 100}ms` }}
          onClick={() => navigate(stat.path)}
        >
          <div className="flex flex-col h-full">
            <div className={`${stat.bgClass} p-2 sm:p-3 text-white`}>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium truncate">{stat.title}</p>
                <div className="rounded-full p-1.5 bg-white/20 animate-pulse">{stat.icon}</div>
              </div>
            </div>
            <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between bg-white dark:bg-gray-800">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold transition-all duration-300">
                {animatedStats[stat.title] || 0}
              </h3>
              <p className={`text-xs sm:text-sm mt-2 ${stat.positive ? 'text-green-600' : 'text-red-600'} font-medium`}>
                {stat.change}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
