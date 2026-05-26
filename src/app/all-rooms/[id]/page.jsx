import BookingCard from '@/components/BookingCard';
import BookingButton from '@/components/BookingCard';
import { DeleteAlert } from '@/components/DeleteAlert';
import { EditModal } from '@/components/EditModal';
import { auth } from '@/lib/auth';
import { Card } from '@heroui/react';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { BsFillPeopleFill } from 'react-icons/bs';
import { FaLayerGroup } from 'react-icons/fa';
import { FaRegTrashCan } from 'react-icons/fa6';
import { MdEdit } from 'react-icons/md';

const RoomsDetailsPage = async ({ params }) => {
  const { id } = await params
  const {token} = await auth.api.getToken({
    headers:await headers()
  })
  console.log(token);
    const session = await auth.api.getSession({
    headers:await headers(),
    });
  console.log(session, "session")
  const res = await fetch(`http://localhost:5000/rooms/${id}`, {
  
    headers: {
      authorization:`Bearer ${token}`
    }
});

if (!res.ok) {
  throw new Error("Failed to fetch room");
}

const room = await res.json();


  const { roomName, floor, amenities, capacity, hourlyRate, imageUrl, userId, description } = room;
console.log(room,"room")
    const user = session?.user;
  const isOwner = user?.id === room?.userId;
  console.log(isOwner, "isOwner");
   const amenitiesArray = Array.isArray(room.amenities)
            ? room.amenities
            : typeof room.amenities === 'string'
            ? room.amenities.split(',').map(a => a.trim())
            : [];
  const displayedAmenities = amenitiesArray.slice(0, 3);
         const remainingCount = amenitiesArray.length - 3;
  return (
    <div className='w-10/12 mx-auto'>
      <div className='grid grid-cols-2 grid-rows-3 gap-2 py-12 '>
        <div className='row-span-3'>
          <Image src={room?.imageUrl} width={600} height={600} alt={roomName}></Image>
          <div className='p-5'>
            <h1 className='text-3xl font-bold text-blue-500'>{roomName}</h1>
            <p className='text-gray-500'>{description}</p>
            
            <p className='text-3xl text-green-500 font-bold my-6'>Amenities</p>
            <div className="card-badges mb-4">What's included<br></br>
                 <div className="flex flex-wrap gap-1.5 min-h-[28px] mt-4">
                  {displayedAmenities.map((amenity, idx) => (
                    <span 
                      key={idx} 
                      className="bg-blue-50 text-blue-600 text-xs font-medium py-1 px-2.5 rounded-md"
                    >
                      {amenity}
                    </span>
                  ))}
                  {remainingCount > 0 && (
                    <span className="bg-gray-100 text-gray-600 text-xs font-semibold py-1 px-2.5 rounded-md">
                      +{remainingCount} more
                    </span>
                  )}
                </div>
                    {/* {Array.isArray(room.amenities) 
                      ? room.amenities.map(amenity => (
                          <span key={(amenity)} className="badge  ">{amenity}</span>
                        ))
                      : typeof room.amenities === 'string'
                      ? room.amenities.split(',').map(amenity => (
                          <span key={amenity.trim()} className="badge py-2.5 px-3.5 mt-4 grid">{amenity.trim()}</span>
                        ))
                      : null
                    } */}
                  </div>
          </div>
       </div>
        <Card className="p-5 border rounded-md space-y-3 ">
          <div className='flex justify-between row-span-2'>
            <p className='text-3xl text-blue-500 font-bold'>${hourlyRate}</p>
            <p className='bg-gray-400 px-3 items-center flex text-white rounded-md'>per hour</p>
          </div>
             <div className="card-meta flex flex-col gap-3 text-green-400">
                          <div className='flex justify-start items-center gap-2'>   <FaLayerGroup /> <span> {room.floor || 'Floor'}</span></div>
                              <div className='flex justify-start items-center gap-2'>
                             <BsFillPeopleFill></BsFillPeopleFill>  <span> {room.capacity || '2'} people</span>
                              </div> 
                              <div >
                                 <span>📅{room.bookingsCount || '0'} bookings</span>
                              </div>
          </div>

          <div>
            <BookingCard room={room}></BookingCard>
          </div>
         
          <div>
            {isOwner && (
                <aside className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm ring-1 ring-stone-900/5">
                <div className="border-b border-rose-100/60 bg-gradient-to-br from-rose-50/80 via-white to-stone-50 px-6 py-5">
                  <p className="text-xs font-semibold uppercase tracking-wide font-bold text-blue-600">
                    Listed By
                  </p>
                  <div className='flex justify-center items-center'>
                    <Image src={user?.image} alt="Created By" width={200} height={200}></Image>
                    <div><p>{user?.name }</p>
                      <h1>{user?.email }</h1></div>
                </div>
                </div>

                <div className="flex flex-col gap-3 p-6">
                  <div className="w-full">
                    <EditModal room={room} />
                  </div>
                  <div className="w-full">
                    <DeleteAlert room={room} />
                  </div>
                </div>
              </aside>
            )}
          </div>
          {/* <Link href={`/`}><button className='w-full rounded-full  py-3  bg-blue-500 text-white'>Book Now</button></Link> */}

         
          

        </Card>
    </div>
    </div>
  );
};

export default RoomsDetailsPage;