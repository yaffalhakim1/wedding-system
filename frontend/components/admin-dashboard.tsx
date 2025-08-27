import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Users,
  Camera,
  MessageSquare,
  Download,
  Eye,
  EyeOff,
  Trash2,
} from 'lucide-react';

// Mock data for demonstration
const mockRsvps = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john@example.com',
    attending: 'yes',
    plusOne: true,
    plusOneName: 'Jane Smith',
    meal: 'chicken',
    status: 'confirmed',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    attending: 'yes',
    plusOne: false,
    meal: 'fish',
    status: 'confirmed',
  },
  {
    id: 3,
    name: 'Mike Wilson',
    email: 'mike@example.com',
    attending: 'no',
    plusOne: false,
    meal: null,
    status: 'declined',
  },
];

const mockMessages = [
  {
    id: 1,
    name: 'Emily Davis',
    message: "Congratulations! Can't wait to celebrate with you both!",
    timestamp: '2024-05-15',
    visible: true,
  },
  {
    id: 2,
    name: 'Robert Brown',
    message: 'Wishing you a lifetime of happiness together!',
    timestamp: '2024-05-14',
    visible: true,
  },
];

const mockPhotos = [
  {
    id: 1,
    uploader: 'Lisa Chen',
    caption: 'Beautiful engagement photos!',
    uploadDate: '2024-05-15',
    visible: true,
  },
  {
    id: 2,
    uploader: 'David Kim',
    caption: 'Excited for the big day!',
    uploadDate: '2024-05-14',
    visible: true,
  },
];

export function AdminDashboard() {
  const [rsvps] = useState(mockRsvps);
  const [messages, setMessages] = useState(mockMessages);
  const [photos, setPhotos] = useState(mockPhotos);

  const attendingCount = rsvps.filter(
    (rsvp) => rsvp.attending === 'yes'
  ).length;
  const notAttendingCount = rsvps.filter(
    (rsvp) => rsvp.attending === 'no'
  ).length;
  const plusOnesCount = rsvps.filter((rsvp) => rsvp.plusOne).length;

  const toggleMessageVisibility = (id: number) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, visible: !msg.visible } : msg
      )
    );
  };

  const togglePhotoVisibility = (id: number) => {
    setPhotos((prev) =>
      prev.map((photo) =>
        photo.id === id ? { ...photo, visible: !photo.visible } : photo
      )
    );
  };

  return (
    <div className='space-y-6'>
      {/* Dashboard Overview */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <Card>
          <CardContent className='flex items-center p-6'>
            <Users className='h-8 w-8 text-green-600' />
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>Attending</p>
              <p className='text-2xl font-bold text-green-600'>
                {attendingCount}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='flex items-center p-6'>
            <Users className='h-8 w-8 text-red-600' />
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>Not Attending</p>
              <p className='text-2xl font-bold text-red-600'>
                {notAttendingCount}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='flex items-center p-6'>
            <Users className='h-8 w-8 text-blue-600' />
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>Plus Ones</p>
              <p className='text-2xl font-bold text-blue-600'>
                {plusOnesCount}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='flex items-center p-6'>
            <MessageSquare className='h-8 w-8 text-purple-600' />
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>Messages</p>
              <p className='text-2xl font-bold text-purple-600'>
                {messages.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue='rsvps' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='rsvps'>RSVPs</TabsTrigger>
          <TabsTrigger value='messages'>Messages</TabsTrigger>
          <TabsTrigger value='photos'>Photos</TabsTrigger>
          <TabsTrigger value='settings'>Settings</TabsTrigger>
        </TabsList>

        {/* RSVPs Tab */}
        <TabsContent value='rsvps'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                RSVP Responses
                <Button variant='outline' size='sm'>
                  <Download className='w-4 h-4 mr-2' />
                  Export CSV
                </Button>
              </CardTitle>
              <CardDescription>
                Manage guest responses and meal preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {rsvps.map((rsvp) => (
                  <div
                    key={rsvp.id}
                    className='flex items-center justify-between p-4 border rounded-lg'
                  >
                    <div className='flex items-center space-x-4'>
                      <Avatar>
                        <AvatarFallback>
                          {rsvp.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className='font-medium'>{rsvp.name}</p>
                        <p className='text-sm text-gray-500'>{rsvp.email}</p>
                        {rsvp.plusOne && (
                          <p className='text-sm text-blue-600'>
                            + {rsvp.plusOneName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className='flex items-center space-x-2'>
                      {rsvp.meal && (
                        <Badge variant='secondary'>{rsvp.meal}</Badge>
                      )}
                      <Badge
                        variant={
                          rsvp.attending === 'yes' ? 'default' : 'destructive'
                        }
                      >
                        {rsvp.attending === 'yes'
                          ? 'Attending'
                          : 'Not Attending'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value='messages'>
          <Card>
            <CardHeader>
              <CardTitle>Guest Messages</CardTitle>
              <CardDescription>
                Manage congratulations and well wishes from guests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {messages.map((message) => (
                  <div key={message.id} className='p-4 border rounded-lg'>
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-2'>
                          <p className='font-medium'>{message.name}</p>
                          <span className='text-sm text-gray-500'>
                            {message.timestamp}
                          </span>
                        </div>
                        <p className='text-gray-700'>{message.message}</p>
                      </div>

                      <div className='flex gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => toggleMessageVisibility(message.id)}
                        >
                          {message.visible ? (
                            <EyeOff className='w-4 h-4' />
                          ) : (
                            <Eye className='w-4 h-4' />
                          )}
                        </Button>
                        <Button variant='outline' size='sm'>
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Photos Tab */}
        <TabsContent value='photos'>
          <Card>
            <CardHeader>
              <CardTitle>Photo Gallery</CardTitle>
              <CardDescription>Manage guest-uploaded photos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {photos.map((photo) => (
                  <div key={photo.id} className='p-4 border rounded-lg'>
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-2'>
                          <Camera className='w-4 h-4 text-gray-500' />
                          <p className='font-medium'>{photo.uploader}</p>
                          <span className='text-sm text-gray-500'>
                            {photo.uploadDate}
                          </span>
                        </div>
                        <p className='text-gray-700'>{photo.caption}</p>
                      </div>

                      <div className='flex gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => togglePhotoVisibility(photo.id)}
                        >
                          {photo.visible ? (
                            <EyeOff className='w-4 h-4' />
                          ) : (
                            <Eye className='w-4 h-4' />
                          )}
                        </Button>
                        <Button variant='outline' size='sm'>
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value='settings'>
          <Card>
            <CardHeader>
              <CardTitle>Wedding Settings</CardTitle>
              <CardDescription>
                Configure your wedding invitation details
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='bride-name'>Bride&apos;s Name</Label>
                  <Input id='bride-name' defaultValue='Sarah' />
                </div>
                <div>
                  <Label htmlFor='groom-name'>Groom&apos;s Name</Label>
                  <Input id='groom-name' defaultValue='Michael' />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='wedding-date'>Wedding Date</Label>
                  <Input
                    id='wedding-date'
                    type='date'
                    defaultValue='2024-06-15'
                  />
                </div>
                <div>
                  <Label htmlFor='wedding-time'>Wedding Time</Label>
                  <Input id='wedding-time' type='time' defaultValue='16:00' />
                </div>
              </div>

              <div>
                <Label htmlFor='venue-name'>Venue Name</Label>
                <Input id='venue-name' defaultValue='Rosewood Manor' />
              </div>

              <div>
                <Label htmlFor='venue-address'>Venue Address</Label>
                <Input
                  id='venue-address'
                  defaultValue='123 Garden Lane, Countryside'
                />
              </div>

              <Button className='bg-rose-600 hover:bg-rose-700'>
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
