
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Phone, Upload, Loader2, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUser } from '@/contexts/UserContext';

const formSchema = z.object({
  first_name: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  last_name: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AdminProfile = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { userProfile, loading, updateProfile, uploadAvatar } = useUser();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
    },
  });

  // Update form when user profile is loaded
  useEffect(() => {
    if (userProfile) {
      form.reset({
        first_name: userProfile.first_name || '',
        last_name: userProfile.last_name || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
      });
    }
  }, [userProfile, form]);

  const onSubmit = async (data: FormValues) => {
    if (!userProfile) return;

    setIsSubmitting(true);

    try {
      await updateProfile({
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone || null,
      });

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Function to trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Combined function to handle file selection and upload
  const handleFileSelectAndUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a JPG, PNG, GIF, or WebP image.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Create a preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Start upload process
    setIsUploading(true);

    try {
      // Use the uploadAvatar function from UserContext
      const avatarUrl = await uploadAvatar(file);

      if (avatarUrl) {
        toast({
          title: "Avatar Updated",
          description: "Your profile picture has been updated successfully.",
        });
      } else {
        throw new Error("Failed to upload avatar");
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload Failed",
        description: "There was a problem uploading your profile picture.",
        variant: "destructive",
      });
      // Reset preview on error
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 flex flex-col items-center">
            <div className="relative mb-4">
              <Avatar className="w-32 h-32 border-4 border-primary/20">
                <AvatarImage
                  src={previewUrl || userProfile?.avatar_url || "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300"}
                  alt="Profile Picture"
                  onError={(e) => {
                    // Fallback if the image fails to load
                    e.currentTarget.src = "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300";
                  }}
                />
                <AvatarFallback>
                  {userProfile ?
                    `${userProfile.first_name?.[0] || ''}${userProfile.last_name?.[0] || ''}` :
                    'AU'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0">
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleFileSelectAndUpload}
                  className="hidden"
                  ref={fileInputRef}
                  disabled={isUploading}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="default"
                        size="icon"
                        className={`rounded-full h-12 w-12 bg-primary hover:bg-primary/90 text-white shadow-md ${isUploading ? 'bg-primary/70' : ''}`}
                        disabled={isUploading}
                        onClick={triggerFileInput}
                      >
                        {isUploading ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                          <Camera className="h-6 w-6" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Upload Profile Picture</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              {isUploading && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <p className="text-xs text-primary flex items-center">
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Uploading image...
                  </p>
                </div>
              )}
            </div>
            <h2 className="text-2xl font-semibold mb-1">
              {userProfile ?
                `${userProfile.first_name || ''} ${userProfile.last_name || ''}` :
                'Admin Profile'}
            </h2>
            <p className="text-muted-foreground mb-2">
              {userProfile?.email || 'Manage your account details'}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-10" placeholder="First name" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-10" placeholder="Last name" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-10 bg-muted/50"
                          placeholder="your.email@example.com"
                          {...field}
                          readOnly
                          disabled
                        />
                      </div>
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
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-10" placeholder="+1 (555) 123-4567" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col space-y-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || loading}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Profile
                    </>
                  ) : (
                    'Update Profile'
                  )}
                </Button>

                {loading && (
                  <div className="text-center text-sm text-muted-foreground">
                    <Loader2 className="inline mr-2 h-3 w-3 animate-spin" />
                    Loading profile data...
                  </div>
                )}
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminProfile;
