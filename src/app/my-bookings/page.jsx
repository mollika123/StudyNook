import { BookingCancelAlert } from '@/components/BookingCancleAlert';
import { auth } from '@/lib/auth';
import { TrashBin } from '@gravity-ui/icons';
import { Button } from '@heroui/react';
import { headers } from 'next/headers';
import Image from 'next/image';
import React from 'react';



const MyBookingPage = async () => {
  const session = await auth.api.getSession({
    headers:await headers()
  })
  console.log(session);
  const user=session?.user
  const res = await fetch(`http://localhost:5000/booking/${user?.id}`)
  const bookings = await res.json()
  console.log(bookings, "bookings");
  // const{ totalCost,startTime, date,endTime,roomName,roomImage}=bookings
  return (
    <div className='w-11/12 mx-auto'>
      <h1 className="text-3xl">My Booking</h1>
      <div>
        {
          bookings.map(booking =>
            
            <div key={booking._id} className='py-8'>
              <div className='grid shadow-xl p-4 space-y-4 md:grid-cols-3 lg:grid-cols-5 items-center'>
                            
                <div className='flex gap-3 justify-center items-center'>
                  <Image src={booking?.roomImage} width={150} height={150} alt='room'></Image>
            <h1>{booking?.roomName }</h1></div>
             

              <p>{booking.date}</p>
              <p>{booking.startTime}-{booking.endTime}</p>
              <p>${booking.totalCost}</p>
              
<BookingCancelAlert bookingId={booking._id}></BookingCancelAlert>

 </div>
          </div>)
        }
      </div>
    </div>
  );
};

export default MyBookingPage;