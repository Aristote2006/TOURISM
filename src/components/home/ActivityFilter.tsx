
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, Filter, Search, MapPin } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const activityTypes = [
  { value: 'all', label: 'All Activities' },
  { value: 'hotel', label: 'Hotels & Resorts' },
  { value: 'restaurant', label: 'Restaurants' },
  { value: 'saloon', label: 'Saloons & Spas' },
  { value: 'lodge', label: 'Lodges' },
  { value: 'adventure', label: 'Adventure' },
];

const locations = [
  { value: 'all', label: 'All Locations' },
  { value: 'beach', label: 'Beach' },
  { value: 'mountain', label: 'Mountain' },
  { value: 'city', label: 'City' },
  { value: 'countryside', label: 'Countryside' },
];

interface ActivityFilterProps {
  onFilterChange: (type: string, location: string, search: string) => void;
}

const ActivityFilter = ({ onFilterChange }: ActivityFilterProps) => {
  const [selectedType, setSelectedType] = useState(activityTypes[0]);
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleTypeChange = (type: typeof activityTypes[0]) => {
    setSelectedType(type);
    onFilterChange(type.value, selectedLocation.value, searchTerm);
  };

  const handleLocationChange = (location: typeof locations[0]) => {
    setSelectedLocation(location);
    onFilterChange(selectedType.value, location.value, searchTerm);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onFilterChange(selectedType.value, selectedLocation.value, e.target.value);
  };

  return (
    <div className="mb-8 bg-white rounded-xl shadow p-4 sticky top-4 z-10">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="w-full md:w-1/2 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search activities..."
            className="w-full pl-10 py-2 border rounded-md"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-2 w-full md:w-auto justify-between">
                <Filter className="h-4 w-4" />
                <span>{selectedType.label}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search types..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {activityTypes.map((type) => (
                      <CommandItem
                        key={type.value}
                        onSelect={() => handleTypeChange(type)}
                        className="cursor-pointer"
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            selectedType.value === type.value
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        {type.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-2 w-full md:w-auto justify-between">
                <MapPin className="h-4 w-4" />
                <span>{selectedLocation.label}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search locations..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {locations.map((location) => (
                      <CommandItem
                        key={location.value}
                        onSelect={() => handleLocationChange(location)}
                        className="cursor-pointer"
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            selectedLocation.value === location.value
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        {location.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default ActivityFilter;
