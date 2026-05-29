"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { BsFillPeopleFill } from 'react-icons/bs';
import { FaLayerGroup } from 'react-icons/fa';

const AllRoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // 1. Fetch data on component mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
       
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/rooms`);
        const data = await res.json();
        setRooms(data);
        setFilteredRooms(data);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      }
    };
    fetchRooms();
  }, []);

  // 2. Handle Filter and Search Logic
  useEffect(() => {
    let updatedRooms = rooms;

    // Filter by Search Name
    if (search) {
      updatedRooms = updatedRooms.filter(room => 
        room.roomName ? room.roomName.toLowerCase().includes(search.toLowerCase()) : false
      );
    }

    // Filter by Amenities safely
    if (selectedAmenities.length > 0) {
      updatedRooms = updatedRooms.filter(room => {
        if (!room.amenities) return false; 
        
        const roomAmenitiesArray = Array.isArray(room.amenities)
          ? room.amenities
          : typeof room.amenities === 'string'
          ? room.amenities.split(',').map(a => a.trim())
          : [];

        return selectedAmenities.every(amenity => roomAmenitiesArray.includes(amenity));
      });
    }

    // Filter by Price Range (hourlyRate দিয়ে ফিক্স করা হয়েছে)
    if (minPrice) {
      updatedRooms = updatedRooms.filter(room => (room.hourlyRate || room.price) >= parseFloat(minPrice));
    }
    if (maxPrice) {
      updatedRooms = updatedRooms.filter(room => (room.hourlyRate || room.price) <= parseFloat(maxPrice));
    }

    setFilteredRooms(updatedRooms);
  }, [search, selectedAmenities, minPrice, maxPrice, rooms]);

  // Toggle Amenity Checkboxes
  const handleAmenityChange = (amenity) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  // Reset Filters
  const handleReset = () => {
    setSearch('');
    setSelectedAmenities([]);
    setMinPrice('');
    setMaxPrice(''); // এখানে আগের ভুলটি (setMaxPrice) ঠিক করা হয়েছে
  };

  return (
    <div className="page-container w-11/12 mx-auto py-8">
      {/* Header Section */}
      {rooms.length === 0 && (
        <div className="text-center py-24 text-slate-400 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-[20px] font-medium mb-6">
          You haven't added any rooms yet.
        </div>
      )}
      
      <header className="header-section space-y-4 mb-6">
        <h1 className='text-5xl font-bold text-blue-400'>All Study Rooms</h1>
        <p className='text-xl text-gray-400 font-bold'>Browse the full catalog. Filter by amenity, price, or search by name.</p>
      </header>

      {/* Main Layout Grid */}
      <div className='grid grid-cols-12 gap-6 py-4'>
        {/* LEFT SIDEBAR: Refine Filters */}
        <aside className="sidebar col-span-12 lg:col-span-3 shadow-xl p-5 space-y-6 h-fit bg-white rounded-xl border border-gray-100">
          <div className="sidebar-header flex justify-between items-center border-b pb-3">
            <h3 className="text-xl font-bold text-blue-400">Refine</h3>
            <button onClick={handleReset} className="text-sm font-semibold text-red-400 hover:text-red-500 transition">Reset</button>
          </div>

          {/* Search Input */}
          <div className="filter-group space-y-2 flex flex-col">
            <label className="text-sm font-semibold text-gray-600">Search by name</label>
            <input 
              type="text" className='bg-gray-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm'
              placeholder="e.g. Quiet Pod" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Amenities Checkboxes */}
          <div className="filter-group space-y-2">
            <label className="text-sm font-semibold text-gray-600 block">Amenities</label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {['Whiteboard', 'Projector', 'Wi-Fi', 'Power Outlets', 'Quiet Zone', 'Air Conditioning'].map(amenity => (
                <div key={amenity} className="checkbox-item flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id={amenity}
                    className="rounded text-blue-500 focus:ring-blue-400 h-4 w-4"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                  />
                  <label htmlFor={amenity} className="text-sm text-gray-600 select-none">{amenity}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Filters */}
          <div className="filter-group space-y-2">
            <label className="text-sm font-semibold text-gray-600">Hourly rate ($)</label>
            <div className="price-inputs flex gap-2">
              <input type="number" placeholder="Min" className="w-full bg-gray-100 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
              <input type="number" placeholder="Max" className="w-full bg-gray-100 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            </div>
          </div>
        </aside>

        {/* RIGHT CONTENT: Rooms Grid */}
        <main className="content-area col-span-12 lg:col-span-9">
          <p className="results-count text-xl mb-6 text-gray-700">
            Showing <strong>{filteredRooms.length}</strong> of {rooms.length} rooms
          </p>
          
          {/* রেসপন্সিভ গ্রিড: ডেক্সটপে ৩ কলাম, ট্যাবলেটে ২ কলাম, মোবাইলে ১ কলাম */}
          <div className="rooms-grid grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRooms.map((room) => {
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
                  key={room.id || room._id} 
                  className="flex flex-col h-full bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-[0.98] transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  {/* ইউনিফর্ম সাইজের ইমেজ সেকশন */}
                  <figure className="h-60 relative w-full flex-shrink-0">
                    <Image 
                      src={room.imageUrl || 'https://via.placeholder.com/300x200'} 
                      alt={room.roomName || 'Study Room'} 
                      fill 
                      className='object-cover' 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </figure>
                  
                  {/* কার্ড বডি (flex-1 এবং flex-col সবগুলোর হাইট সবসময় সমান রাখবে) */}
                  <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                    
                    {/* নাম ও প্রাইস */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className='text-xl font-bold text-gray-800 line-clamp-1'>
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
                    
                    {/* ফ্লোর, ক্যাপাসিটি এবং বুকিং */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-600 text-xs font-medium border-t border-b border-gray-100 py-2.5">
                      <div className='flex items-center gap-1.5'> 
                        <FaLayerGroup className="text-blue-400" /> 
                        <span>Floor {room.floor || 'N/A'}</span>
                      </div>
                      <div className='flex items-center gap-1.5'>
                        <BsFillPeopleFill className="text-blue-400" />  
                        <span>{room.capacity || '2-4'} people</span>
                      </div> 
                      <div className="flex items-center gap-1">
                        <span>📅 {room.bookingsCount || '0'} bookings</span>
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
                    {/* <div className="flex flex-wrap gap-1.5 min-h-[28px]">
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
                    </div> */}

                    {/* ভিউ ডিটেইলস বাটন */}
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
        </main>
      </div>
    </div>
  );
};

export default AllRoomsPage;