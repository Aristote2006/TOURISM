
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Search, Filter, ChevronDown, ChevronUp, MapPin, Star } from 'lucide-react';
import { useActivities } from '@/contexts/ActivityContext';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Activities will come from the ActivityContext

interface ActivityTableProps {
  initialFilterType?: string | null;
}

const ActivityTable = ({ initialFilterType = null }: ActivityTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterType, setFilterType] = useState(initialFilterType || 'All');
  const [filterLocation, setFilterLocation] = useState('All');
  const { toast } = useToast();
  const { activities, deleteActivity, toggleFeatured } = useActivities();

  // Update filter type when initialFilterType changes
  useEffect(() => {
    if (initialFilterType) {
      setFilterType(initialFilterType);
    }
  }, [initialFilterType]);

  // Default activity types and locations
  const activityTypes = ["All", "Hotel", "Restaurant", "Saloon", "Lodge", "Adventure"];

  // Extract unique locations from activities or use defaults if empty
  const locations = activities.length > 0
    ? ['All', ...Array.from(new Set(activities.map(a => a.location)))]
    : ['All', 'City', 'Beach', 'Mountain', 'Countryside'];

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredActivities = activities.filter(activity => {
    return (
      (filterType === 'All' || activity.type === filterType) &&
      (filterLocation === 'All' || activity.location === filterLocation) &&
      (
        activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }).sort((a, b) => {
    // @ts-ignore
    const aValue = a[sortField]?.toLowerCase() || '';
    // @ts-ignore
    const bValue = b[sortField]?.toLowerCase() || '';

    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : 1;
    } else {
      return aValue > bValue ? -1 : 1;
    }
  });

  const clearFilters = () => {
    setFilterType('All');
    setFilterLocation('All');
    setSearchTerm('');
    setSortField('name');
    setSortDirection('asc');
  };

  // Calculate active filter count
  const activeFilterCount = [
    filterType !== 'All' ? 1 : 0,
    filterLocation !== 'All' ? 1 : 0,
    searchTerm ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  const handleDelete = (id: string) => {
    deleteActivity(id);
    toast({
      title: "Activity deleted",
      description: "The activity has been successfully deleted.",
    });
  };

  const handleToggleFeatured = (id: string) => {
    toggleFeatured(id);
    toast({
      title: "Featured Status Updated",
      description: "The activity's featured status has been updated.",
    });
  };

  const handleEdit = (id: string) => {
    // In a real app, this would navigate to edit form
    console.log(`Edit activity ${id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Activities</h3>
          {activeFilterCount > 0 && (
            <Badge variant="outline" className="ml-2">
              {filteredActivities.length} of {activities.length} activities
              {activeFilterCount > 0 && ` • ${activeFilterCount} ${activeFilterCount === 1 ? 'filter' : 'filters'} active`}
            </Badge>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search activities..."
            className="pl-9 pr-4 py-2 w-full rounded-md border text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex gap-2 w-full text-sm h-9"
              >
                <Filter className="h-4 w-4" />
                <span>Type: {filterType}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              {activityTypes.map(type => (
                <DropdownMenuItem
                  key={type}
                  className={`text-sm ${filterType === type ? 'bg-muted font-medium' : ''}`}
                  onClick={() => setFilterType(type)}
                >
                  {type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex gap-2 w-full text-sm h-9"
              >
                <MapPin className="h-4 w-4" />
                <span>Location: {filterLocation}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px] max-h-[300px] overflow-auto">
              {locations.map(location => (
                <DropdownMenuItem
                  key={location}
                  className={`text-sm ${filterLocation === location ? 'bg-muted font-medium' : ''}`}
                  onClick={() => setFilterLocation(location)}
                >
                  {location}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {(filterType !== 'All' || filterLocation !== 'All' || searchTerm) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-9"
            >
              Clear Filters
            </Button>
          )}
        </div>
        </div>
      </div>

      {/* No Results Message */}
      {filteredActivities.length === 0 && (
        <div className="text-center py-12 border rounded-md bg-white dark:bg-gray-800">
          {activeFilterCount > 0 ? (
            <>
              <div className="text-muted-foreground mb-2">No activities found matching your filters</div>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2">No Activities Yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                You haven't added any activities yet. Get started by adding your first activity.
              </p>
              <Button
                onClick={() => window.location.href = '/admin/add-activity'}
                className="bg-primary hover:bg-primary/90"
              >
                Add Your First Activity
              </Button>
            </>
          )}
        </div>
      )}

      {/* Mobile Card View */}
      {filteredActivities.length > 0 && (
        <div className="sm:hidden space-y-3">
          {filteredActivities.map((activity) => (
          <div key={activity.id} className="border rounded-lg p-3 bg-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-md overflow-hidden shrink-0">
                <img
                  src={activity.image}
                  alt={activity.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback image if the original fails to load
                    e.currentTarget.src = "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=200";
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium truncate">{activity.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">{activity.type}</Badge>
                  <span className="text-xs text-muted-foreground">{activity.location}</span>
                </div>
                {activity.fullAddress && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {activity.fullAddress}
                  </div>
                )}
                {activity.latitude && activity.longitude && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Coordinates: {activity.latitude}, {activity.longitude}
                  </div>
                )}
              </div>
            </div>

            <div className="text-xs text-muted-foreground mb-3">
              <div>{activity.contact}</div>
              <div>{activity.phone}</div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-2">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-2 ${activity.featured ? "text-yellow-500" : ""}`}
                onClick={() => handleToggleFeatured(activity.id)}
              >
                <Star className={`h-3.5 w-3.5 mr-1 ${activity.featured ? "fill-yellow-500" : ""}`} />
                {activity.featured ? "Featured" : "Feature"}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => handleEdit(activity.id)}
              >
                <Edit className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-destructive">
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="w-[calc(100vw-32px)] sm:w-auto">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Activity</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete {activity.name}? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(activity.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Desktop Table View */}
      {filteredActivities.length > 0 && (
        <div className="rounded-md border hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Name
                  {sortField === 'name' && (
                    sortDirection === 'asc' ?
                      <ChevronUp className="ml-1 h-4 w-4" /> :
                      <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('location')}
              >
                <div className="flex items-center">
                  Location
                  {sortField === 'location' && (
                    sortDirection === 'asc' ?
                      <ChevronUp className="ml-1 h-4 w-4" /> :
                      <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredActivities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>
                  <div className="w-10 h-10 rounded-md overflow-hidden">
                    <img
                      src={activity.image}
                      alt={activity.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback image if the original fails to load
                        e.currentTarget.src = "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=200";
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{activity.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{activity.type}</Badge>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="text-sm">{activity.contact}</div>
                    <div className="text-xs text-muted-foreground">{activity.phone}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div>{activity.location}</div>
                    {activity.fullAddress && (
                      <div className="text-xs text-muted-foreground">
                        {activity.fullAddress}
                      </div>
                    )}
                    {activity.latitude && activity.longitude && (
                      <div className="text-xs text-muted-foreground">
                        Coordinates: {activity.latitude}, {activity.longitude}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleFeatured(activity.id)}
                      title={activity.featured ? "Remove from featured" : "Add to featured"}
                    >
                      <Star className={`h-4 w-4 ${activity.featured ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`} />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(activity.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Activity</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {activity.name}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(activity.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      )}
    </div>
  );
};

export default ActivityTable;
