
import React from 'react';
import ActivityCard from './ActivityCard';
import { Button } from '@/components/ui/button';
import { useActivities } from '@/contexts/ActivityContext';

const FeaturedActivities = () => {
  const { activities } = useActivities();

  // Filter only featured activities
  const featuredActivities = activities.filter(activity => activity.featured);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4">
        <h2 className="section-heading text-center mb-12">Featured Experiences</h2>

        {featuredActivities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredActivities.map((activity) => (
              <div key={activity.id} className="animate-fade-in">
                <ActivityCard activity={activity} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-md bg-white dark:bg-gray-800">
            <h3 className="text-xl font-medium mb-2">No Featured Activities Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              The administrator hasn't added any featured activities yet. Check back soon!
            </p>
            <Button
              onClick={() => window.location.href = '/admin'}
              className="bg-primary hover:bg-primary/90"
            >
              Go to Admin Dashboard
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedActivities;
