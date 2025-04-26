
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

interface ActivityCardProps {
  activity: {
    id: string;
    name: string;
    type: string;
    image: string;
    description: string;
    location: string;
    featured?: boolean;
  };
}

const ActivityCard = ({ activity }: ActivityCardProps) => {
  return (
    <div className="activity-card group h-full flex flex-col">
      <div className="relative overflow-hidden">
        <img
          src={activity.image}
          alt={activity.name}
          loading="lazy"
          className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            // Fallback image if the original fails to load
            e.currentTarget.src = "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=800";
          }}
        />
        {activity.featured && (
          <Badge className="absolute top-3 right-3 bg-tourism-yellow text-black">
            Featured
          </Badge>
        )}
      </div>

      <div className="flex-1 p-4 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="bg-muted/50">
            {activity.type}
          </Badge>
        </div>

        <h3 className="text-xl font-semibold mb-2">{activity.name}</h3>

        <p className="text-muted-foreground text-sm mb-3 flex-grow">
          {activity.description.length > 100
            ? `${activity.description.substring(0, 100)}...`
            : activity.description}
        </p>

        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{activity.location}</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
