
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useActivities } from '@/contexts/ActivityContext';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  type: z.string().min(1, { message: 'Activity type is required' }),
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(6, { message: 'Phone number is required' }),
  location: z.string().min(5, { message: 'Location is required' }),
  fullAddress: z.string().min(5, { message: 'Full address is required' }),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  description: z.string().min(20, { message: 'Description must be at least 20 characters' }),
  featured: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const AddActivityForm = () => {
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { addActivity } = useActivities();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: '',
      name: '',
      email: '',
      phone: '',
      location: '',
      fullAddress: '',
      latitude: '',
      longitude: '',
      description: '',
      featured: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      // Use the first image as the main image or a placeholder based on type
      let imageUrl = images.length > 0 ? images[0] : "";

      // If no image uploaded, use a placeholder based on activity type
      if (!imageUrl) {
        switch(data.type.toLowerCase()) {
          case 'hotel':
            imageUrl = "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800";
            break;
          case 'restaurant':
            imageUrl = "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=800";
            break;
          case 'saloon':
            imageUrl = "https://images.pexels.com/photos/3188/love-romantic-bath-candlelight.jpg?auto=compress&cs=tinysrgb&w=800";
            break;
          case 'lodge':
            imageUrl = "https://images.pexels.com/photos/803975/pexels-photo-803975.jpeg?auto=compress&cs=tinysrgb&w=800";
            break;
          case 'adventure':
            imageUrl = "https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=800";
            break;
          default:
            imageUrl = "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=800";
        }
      }

      // Add the activity to our context
      addActivity({
        name: data.name,
        type: data.type,
        image: imageUrl,
        description: data.description,
        location: data.location,
        fullAddress: data.fullAddress,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        contact: data.email,
        phone: data.phone,
        featured: data.featured
      });

      toast({
        title: "Activity Added",
        description: "The activity has been successfully added.",
      });

      // Reset form and images
      form.reset();
      setImages([]);

      // Navigate to activities page
      navigate('/admin/activities');
    } catch (error) {
      console.error('Error adding activity:', error);
      toast({
        title: "Error",
        description: "There was a problem adding the activity.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Check if we already have 3 images
    if (images.length + files.length > 3) {
      toast({
        title: "Too many images",
        description: "Maximum 3 images allowed.",
        variant: "destructive"
      });
      return;
    }

    // Convert each file to data URL
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value as string}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Hotel">Hotel & Resort</SelectItem>
                      <SelectItem value="Restaurant">Restaurant</SelectItem>
                      <SelectItem value="Saloon">Saloon & Spa</SelectItem>
                      <SelectItem value="Lodge">Lodge</SelectItem>
                      <SelectItem value="Adventure">Adventure</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="contact@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the location name (e.g., Coastal Bay, Mountain View)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fullAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Address</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter the complete address"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g. -1.4977639" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g. 29.5834646" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value as boolean}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Featured Activity</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    This activity will be displayed on the homepage
                  </p>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Detailed description of the activity"
                    className="resize-none min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <div className="mb-2">
              <FormLabel>Images (Maximum 3)</FormLabel>
              <p className="text-sm text-muted-foreground mt-1">
                Upload up to 3 high-quality images
              </p>
            </div>

            {images.length < 3 && (
              <div className="mb-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  multiple
                />
                <label htmlFor="image-upload">
                  <div className="border-2 border-dashed border-border rounded-md p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Click to upload images</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </label>
              </div>
            )}

            {images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {images.map((image, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-0 relative">
                      <img
                        src={image}
                        alt={`Uploaded ${index + 1}`}
                        className="w-full h-40 object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                        onClick={() => removeImage(index)}
                        type="button"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting
              </>
            ) : (
              'Add Activity'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddActivityForm;
