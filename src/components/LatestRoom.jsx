"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { BsFillPeopleFill } from 'react-icons/bs';
import { FaLayerGroup } from 'react-icons/fa';
export const metadata = {
  title: "Latest Room",

};
const LatestRooms = () => {
  const [latestRooms, setLatestRooms] = useState([]);

  useEffect(() => {
    const fetchLatestRooms = async () => {
      try {
        // ব্যাকএন্ডের নতুন তৈরি করা '/latest-rooms' এপিআই কল করা হয়েছে
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/latest-rooms`);
        const data = await res.json();
        setLatestRooms(data);
      } catch (err) {
        console.error("Error fetching latest rooms:", err);
      }
    };
    fetchLatestRooms();
  }, []);

  return (
    <div className="w-11/12 mx-auto py-12">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-blue-400">Available Study Rooms</h2>
        <p className="text-gray-400 mt-2">Discover our newest study spaces equipped for your productivity.</p>
      </div>

      {/* রেসপন্সিভ গ্রিড: ডেক্সটপে ৩ কলাম, ট্যাবলেটে ২ কলাম, মোবাইলে ১ কলাম */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {latestRooms.map((room) => {
          // এমেনিটিজ ডেটাকে সেফলি অ্যারেতে কনভার্ট করা
          const amenitiesArray = Array.isArray(room.amenities)
            ? room.amenities
            : typeof room.amenities === 'string'
            ? room.amenities.split(',').map(a => a.trim())
            : [];

          // সর্বোচ্চ ৩টি দেখাবো, বাকিগুলো "+X more" হিসেবে থাকবে
          const displayedAmenities = amenitiesArray.slice(0, 3);
          const remainingCount = amenitiesArray.length - 3;

          return (
            <div 
              key={room._id} 
              className="flex flex-col h-full bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-[0.98] transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* ইউনিফর্ম সাইজের ইমেজ সেকশন */}
              <figure className="h-60 relative w-full flex-shrink-0">
                <Image 
                  src={room.imageUrl || 'https://c8.alamy.com/comp/2J9DWR7/the-beautiful-book-covered-walls-of-the-library-room-at-the-1926-medieval-style-hammond-castle-built-by-john-hays-hammond-jr-gloucester-massachusett-2J9DWR7.jpg'} 
                  alt={room.roomName || 'Study Room'} 
                  fill 
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </figure>
              
              {/* কার্ড বডি (flex-1 এবং flex-col কার্ডগুলোর হাইট সমান রাখবে) */}
              <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                
                {/* নাম ও প্রাইস */}
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-1">
                      {room.roomName || 'No Name'}
                    </h3>
                    <span className="flex-shrink-0 bg-green-500 text-white text-sm font-semibold py-1 px-3 rounded-full">
                      ${room.hourlyRate || 0}/hr
                    </span>
                  </div>
                  
                  {/* ডেসক্রিপশন: ~১০০ ক্যারেক্টারে ট্রাঙ্কেট করা */}
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {room.description && room.description.length > 100
                      ? `${room.description.substring(0, 100)}...`
                      : room.description || 'No description available.'}
                  </p>
                </div>

                {/* ফ্লোর এবং ক্যাপাসিটি */}
                <div className="flex gap-4 text-gray-600 text-sm font-medium border-t border-b border-gray-100 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <FaLayerGroup className="text-blue-400" /> 
                    <span>Floor {room.floor || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BsFillPeopleFill className="text-blue-400" /> 
                    <span>{room.capacity || '2-4'} people</span>
                  </div>
                </div>

                {/* এমেনিটিজ চিপস (Max 3 + Rest) */}
                <div className="flex flex-wrap gap-1.5 min-h-[28px]">
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

                {/* ভিউ ডিটেইলস বাটন (সবসময় কার্ডের নিচে ফিক্সড থাকবে) */}
                <div className="pt-2">
                  <Link href={`/all-rooms/${room._id}`} className="block">
                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200 text-center text-sm">
                      View Details
                    </button>
                  </Link>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LatestRooms;