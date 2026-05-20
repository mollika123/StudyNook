import { DeleteAlert } from '@/components/DeleteAlert';
import { EditModal } from '@/components/EditModal';
import { Card } from '@heroui/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { BsFillPeopleFill } from 'react-icons/bs';
import { FaLayerGroup } from 'react-icons/fa';
import { FaRegTrashCan } from 'react-icons/fa6';
import { MdEdit } from 'react-icons/md';

const RoomsDetailsPage = async ({ params }) => {
  const { id } = await params
  const res = await fetch(`http://localhost:5000/rooms/${id}`)
  const room = await res.json();
  console.log(room);
  const { roomName, floor, amenities, capacity, hourlyRate, imageUrl, description } = room;
  return (
    <div className='w-10/12 mx-auto'>
      <div className='grid grid-cols-2 grid-rows-3 gap-2 py-12 '>
        <div className='row-span-3'>
          <Image src={imageUrl} width={600} height={600} alt={roomName}></Image>
          <div className='p-5'>
            <h1 className='text-3xl font-bold text-blue-500'>{roomName}</h1>
            <p className='text-gray-500'>{description}</p>
            
            <p className='text-3xl text-green-500 font-bold my-6'>Amenities</p>
             <div className="card-badges ">
                    {Array.isArray(room.amenities) 
                      ? room.amenities.map(amenity => (
                          <span key={(amenity)} className="badge ">{amenity}</span>
                        ))
                      : typeof room.amenities === 'string'
                      ? room.amenities.split(',').map(amenity => (
                          <span key={amenity.trim()} className="badge py-2.5 px-3.5">{amenity.trim()}</span>
                        ))
                      : null
                    }
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
          
          <Link href={`/`}><button className='w-full rounded-full  py-3  bg-blue-500 text-white'>Book Now</button></Link>

          <div className='grid grid-cols-2 gap-3 mt-7'>
            <EditModal room={room}></EditModal>
           <DeleteAlert room={room}></DeleteAlert>
            {/* <Link href={`/`}><button className=' rounded-md  flex justify-center items-center py-3  bg-gray-800 w-full gap-2 font-bold text-red-600'><FaRegTrashCan/>Delete</button></Link> */}

          </div>
          

        </Card>
    </div>
    </div>
  );
};

export default RoomsDetailsPage;