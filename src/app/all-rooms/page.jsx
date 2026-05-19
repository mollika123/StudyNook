"use client";

import Image from 'next/image';
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
        const res = await fetch('http://localhost:5000/rooms');
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
        room.name ? room.name.toLowerCase().includes(search.toLowerCase()) : false
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

    // Filter by Price Range
    if (minPrice) {
      updatedRooms = updatedRooms.filter(room => room.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      updatedRooms = updatedRooms.filter(room => room.price <= parseFloat(maxPrice));
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
    maxPrice('');
  };

  return (
    <div className="page-container w-11/12 mx-auto py-8">
      {/* Header Section */}
      <header className="header-section space-y-4">
        <h1 className='text-5xl font-bold text-blue-400'>All Study Rooms</h1>
        <p className='text-xl text-gray-400 font-bold'>Browse the full catalog. Filter by amenity, price, or search by name.</p>
      </header>

      <div className="main-layout py-9 gap-3">
        {/* LEFT SIDEBAR: Refine Filters */}
        <div className='grid grid-cols-12 gap-4'>
          

              <aside className="sidebar col-span-3 shadow-xl p-4 space-y-2 h-100">
          <div className="sidebar-header flex justify-between">
            <h3 className="text-xl font-bold text-blue-400">Refine</h3>
            <button onClick={handleReset} className="reset-btn">Reset</button>
          </div>

          {/* Search Input */}
          <div className="filter-group">
            <label>Search by name</label>
            <input 
              type="text" className='bg-gray-300 p-3 rounded-xl'
              placeholder="e.g. Quiet Pod" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Amenities Checkboxes */}
          <div className="filter-group">
            <label>Amenities</label>
            {['Whiteboard', 'Projector', 'Wi-Fi', 'Power Outlets', 'Quiet Zone', 'Air Conditioning'].map(amenity => (
              <div key={amenity} className="checkbox-item">
                <input 
                  type="checkbox" 
                  id={amenity}
                  checked={selectedAmenities.includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                />
                <label htmlFor={amenity}>{amenity}</label>
              </div>
            ))}
          </div>

          {/* Price Filters */}
          <div className="filter-group">
            <label>Hourly rate ($)</label>
            <div className="price-inputs">
              <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
              <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            </div>
          </div>
        </aside>

        {/* RIGHT CONTENT: Rooms Grid */}
        <main className="content-area col-span-9">
  
                       <p className="results-count text-xl mb-6">Showing <strong>{filteredRooms.length}</strong> of {rooms.length} rooms</p>
          
          <div className="rooms-grid grid grid-cols-3 gap-4">
            {filteredRooms.map((room) => (
              <div key={room.id || room._id} className="room-card hover:scale-95  transition-transform duration-300 delay-300 box-shadow: 0 20px 40px rgba(0,0,0,0.1)" >
                <div className="card-image-wrapper rounded-md ">

                  <figure className="h-64 relative">
   <Image src={room.imageUrl || 'https://via.placeholder.com/300x200'}  alt={room.roomName || 'Room' } fill className='object-cover' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"/>

                  </figure>
               
                </div>
                
                <div className="card-body p-4 shadow-xl space-y-3">
                  <div className="card-title-row flex justify-between">
                    <h3 className='text-xl text-blue-600 font-bold'>{room.roomName || 'No Name'}</h3>
                    <span className="price-tag bg-green-500 py-1.5  px-4 rounded-full">${room.hourlyRate || 0}/hr</span>
                  </div>
                  
                  <p className="card-description text-gray-500">{room.description || 'No description available.'}</p>
                  
                  <div className="card-meta flex gap-3 text-green-400">
                <div className='flex justify-start items-center gap-2'>   <FaLayerGroup /> <span> {room.floor || 'Floor'}</span></div>
                    <div className='flex justify-start items-center gap-2'>
                   <BsFillPeopleFill></BsFillPeopleFill>  <span> {room.capacity || '2'} people</span>
                    </div> 
                    <div >
                       <span>📅{room.bookingsCount || '0'} bookings</span>
                    </div>
                  </div>

                  {/* Safely Render Badges */}
                  <div className="card-badges ">
                    {Array.isArray(room.amenities) 
                      ? room.amenities.map(amenity => (
                          <span key={amenity} className="badge ">{amenity}</span>
                        ))
                      : typeof room.amenities === 'string'
                      ? room.amenities.split(',').map(amenity => (
                          <span key={amenity.trim()} className="badge py-2.5 px-3.5">{amenity.trim()}</span>
                        ))
                      : null
                    }
                  </div>
                     <button className="view-details-btn bg-blue-500 px-4 py-3 text-white rounded-md" >View Details</button>
                </div>

             
              </div>
            ))}
          </div>
 
        </main>
    </div>
      </div>
    </div>
  );
};

export default AllRoomsPage;