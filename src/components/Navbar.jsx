"use client";
import { useState } from "react";
import Image from "next/image";
// import logo from "../assets/tileshop_logo.svg";
import Link from "next/link";
// import { authClient } from "@/lib/auth-client";
import NavLink from "./NavLink";
import { Menu, X } from "lucide-react"; // Iconer jonno 'npm install lucide-react' korun

const Navbar = () => {
  // const { data: session, isLoading } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state

  // const user = session?.user;

  // if (isLoading) return null;

  return (
    <nav className="sticky top-0 z-50   border-b border-gray-100 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex w-11/12 items-center justify-between p-4 lg:px-8">
        
        {/* Logo Section */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center justify-center">
            <Image src={'/resource.png'} width={160} height={40} alt="logo" className="h-8 w-auto" /><span className="text-2xl font-bold text-blue-600">StudyNook</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden font-bold md:flex md:gap-x-8">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/all-rooms">Rooms</NavLink>
          <NavLink href="/add-rooms">Add Rooms</NavLink>
        
        </div>

        {/* Auth Button (Desktop) */}
        <div className="hidden md:flex md:flex-1 md:justify-end gap-2">
        
         <NavLink href="/login"   className=" rounded-lg bg-indigo-600 py-2 text-white font-bold text-center py-3 px-5">Login</NavLink>
          <NavLink href="/register"   className=" rounded-lg bg-indigo-600 py-3 px-5 text-white font-bold text-center">Register</NavLink>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4 shadow-xl">
          <div className="flex flex-col gap-4 text-center font-medium">
            <Link href="/" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/all-rooms" onClick={() => setIsOpen(false)}>Rooms</Link>
            <Link href="/add-rooms" onClick={() => setIsOpen(false)}>Add Rooms</Link>
           <Link href="/my-profile" onClick={() => setIsOpen(false)}>My Profile</Link>
            
            <hr className="border-gray-100" />
            
       
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full rounded-lg bg-indigo-600 py-2 text-white font-bold text-center"
              >
                Login
              </Link>
          
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;