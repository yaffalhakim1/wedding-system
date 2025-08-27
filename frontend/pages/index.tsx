import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Playfair_Display } from 'next/font/google';
import { Calendar, MapPin, Clock, Heart } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
});

interface WeddingInfo {
  bride: string;
  groom: string;
  date: string;
  time: string;
  venue: {
    name: string;
    address: string;
  };
  ceremony: {
    time: string;
    location: string;
  };
  reception: {
    time: string;
    location: string;
  };
}

const weddingData: WeddingInfo = {
  bride: 'Sarah',
  groom: 'Michael',
  date: 'June 15, 2024',
  time: '4:00 PM',
  venue: {
    name: 'Rosewood Manor',
    address: '123 Garden Lane, Countryside',
  },
  ceremony: {
    time: '4:00 PM',
    location: 'Garden Pavilion',
  },
  reception: {
    time: '6:00 PM',
    location: 'Grand Ballroom',
  },
};

type ActiveSection = 'invitation' | 'details' | 'rsvp' | 'photos' | 'messages';

export default function Home() {
  const [activeSection, setActiveSection] =
    useState<ActiveSection>('invitation');

  const renderInvitation = () => (
    <Card className='w-full max-w-2xl mx-auto shadow-2xl bg-white/95 backdrop-blur'>
      <CardHeader className='text-center space-y-6 pb-8'>
        <div className={`${playfair.className} text-rose-600`}>
          <CardTitle className='text-4xl md:text-5xl font-light tracking-wide mb-2'>
            Wedding Invitation
          </CardTitle>
          <CardDescription className='text-xl text-rose-500 font-medium'>
            You&apos;re invited to celebrate our special day
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className='space-y-8 text-center'>
        <div className='space-y-4'>
          <div className='flex items-center justify-center gap-2 mb-4'>
            <Heart className='w-6 h-6 text-rose-500' />
          </div>
          <h2
            className={`text-3xl font-semibold text-gray-800 ${playfair.className}`}
          >
            {weddingData.bride} & {weddingData.groom}
          </h2>
          <p className='text-gray-600 leading-relaxed max-w-lg mx-auto'>
            Together with our families, we invite you to join us as we exchange
            vows and begin our journey as husband and wife.
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-6 my-8'>
          <div className='space-y-2'>
            <div className='flex items-center justify-center gap-2'>
              <Calendar className='w-5 h-5 text-rose-600' />
              <h3 className='font-semibold text-gray-800'>Date</h3>
            </div>
            <p className='text-gray-600'>{weddingData.date}</p>
          </div>
          <div className='space-y-2'>
            <div className='flex items-center justify-center gap-2'>
              <MapPin className='w-5 h-5 text-rose-600' />
              <h3 className='font-semibold text-gray-800'>Venue</h3>
            </div>
            <p className='text-gray-600'>{weddingData.venue.name}</p>
            <p className='text-sm text-gray-500'>{weddingData.venue.address}</p>
          </div>
        </div>

        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Link href='/rsvp'>
            <Button className='bg-rose-600 hover:bg-rose-700 text-white px-8'>
              RSVP Now
            </Button>
          </Link>
          <Button
            onClick={() => setActiveSection('details')}
            variant='outline'
            className='border-rose-600 text-rose-600 hover:bg-rose-50 px-8'
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderDetails = () => (
    <Card className='w-full max-w-3xl mx-auto shadow-2xl bg-white/95 backdrop-blur'>
      <CardHeader className='text-center pb-6'>
        <CardTitle className={`text-3xl text-rose-600 ${playfair.className}`}>
          Wedding Details
        </CardTitle>
      </CardHeader>

      <CardContent className='space-y-8'>
        <div className='grid md:grid-cols-2 gap-8'>
          <div className='text-center space-y-4'>
            <div className='flex items-center justify-center gap-2'>
              <Clock className='w-6 h-6 text-rose-600' />
              <h3 className='text-xl font-semibold text-gray-800'>Ceremony</h3>
            </div>
            <div className='space-y-2'>
              <p className='text-lg text-gray-700'>
                {weddingData.ceremony.time}
              </p>
              <p className='text-gray-600'>{weddingData.ceremony.location}</p>
              <p className='text-sm text-gray-500'>{weddingData.venue.name}</p>
            </div>
          </div>

          <div className='text-center space-y-4'>
            <div className='flex items-center justify-center gap-2'>
              <Heart className='w-6 h-6 text-rose-600' />
              <h3 className='text-xl font-semibold text-gray-800'>Reception</h3>
            </div>
            <div className='space-y-2'>
              <p className='text-lg text-gray-700'>
                {weddingData.reception.time}
              </p>
              <p className='text-gray-600'>{weddingData.reception.location}</p>
              <p className='text-sm text-gray-500'>{weddingData.venue.name}</p>
            </div>
          </div>
        </div>

        <div className='text-center space-y-4 pt-6 border-t'>
          <h3 className='text-xl font-semibold text-gray-800'>
            Additional Information
          </h3>
          <div className='space-y-3 text-gray-600 max-w-2xl mx-auto'>
            <p>
              Cocktail hour will begin at 5:00 PM between the ceremony and
              reception.
            </p>
            <p>
              Dinner will be served at 7:00 PM followed by dancing and
              celebration.
            </p>
            <p>We kindly request your presence for this joyous occasion.</p>
          </div>
        </div>

        <div className='flex flex-col sm:flex-row gap-4 justify-center pt-6'>
          <Link href='/rsvp'>
            <Button className='bg-rose-600 hover:bg-rose-700 text-white px-8'>
              RSVP Now
            </Button>
          </Link>
          <Button
            onClick={() => setActiveSection('invitation')}
            variant='outline'
            className='border-rose-600 text-rose-600 hover:bg-rose-50 px-8'
          >
            Back to Invitation
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'invitation':
        return renderInvitation();
      case 'details':
        return renderDetails();
      case 'rsvp':
        return (
          <Card className='w-full max-w-2xl mx-auto shadow-2xl bg-white/95 backdrop-blur'>
            <CardContent className='text-center py-12'>
              <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
                RSVP
              </h2>
              <p className='text-gray-600 mb-6'>
                Let us know if you&apos;ll be joining us!
              </p>
              <Link href='/rsvp'>
                <Button className='bg-rose-600 hover:bg-rose-700 text-white px-8'>
                  Go to RSVP Form
                </Button>
              </Link>
            </CardContent>
          </Card>
        );
      case 'photos':
        return (
          <Card className='w-full max-w-2xl mx-auto shadow-2xl bg-white/95 backdrop-blur'>
            <CardContent className='text-center py-12'>
              <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
                Photo Gallery
              </h2>
              <p className='text-gray-600 mb-6'>
                Share your favorite moments with everyone!
              </p>
              <Link href='/photos'>
                <Button className='bg-rose-600 hover:bg-rose-700 text-white px-8'>
                  View Photo Gallery
                </Button>
              </Link>
            </CardContent>
          </Card>
        );
      case 'messages':
        return (
          <Card className='w-full max-w-2xl mx-auto shadow-2xl bg-white/95 backdrop-blur'>
            <CardContent className='text-center py-12'>
              <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
                Guest Messages
              </h2>
              <p className='text-gray-600 mb-6'>
                Share your congratulations and well wishes!
              </p>
              <Link href='/messages'>
                <Button className='bg-rose-600 hover:bg-rose-700 text-white px-8'>
                  View Messages
                </Button>
              </Link>
            </CardContent>
          </Card>
        );
      default:
        return renderInvitation();
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center p-4'>
      {renderSection()}

      {activeSection !== 'invitation' && (
        <div className='fixed bottom-8 left-1/2 transform -translate-x-1/2'>
          <nav className='flex gap-2 bg-white/90 backdrop-blur rounded-full px-4 py-2 shadow-lg'>
            <Button
              onClick={() => setActiveSection('invitation')}
              variant='ghost'
              size='sm'
              className='rounded-full'
            >
              Home
            </Button>
            <Button
              onClick={() => setActiveSection('details')}
              variant='ghost'
              size='sm'
              className='rounded-full'
            >
              Details
            </Button>
            <Button
              onClick={() => setActiveSection('rsvp')}
              variant='ghost'
              size='sm'
              className='rounded-full'
            >
              RSVP
            </Button>
            <Button
              onClick={() => setActiveSection('photos')}
              variant='ghost'
              size='sm'
              className='rounded-full'
            >
              Photos
            </Button>
            <Button
              onClick={() => setActiveSection('messages')}
              variant='ghost'
              size='sm'
              className='rounded-full'
            >
              Messages
            </Button>
          </nav>
        </div>
      )}
    </div>
  );
}
