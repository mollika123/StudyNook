"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import NavLink from "./NavLink";
import { Menu, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Avatar, Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { BsMoon, BsSun } from "react-icons/bs";

const Navbar = () => {
  const { data: session } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const user = session?.user;

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // PUBLIC ROUTES
  const publicLinks = [
    { href: "/", label: "Home" },
    { href: "/all-rooms", label: "Rooms" },
  ];

  // PRIVATE ROUTES
  const privateLinks = [
    { href: "/add-rooms", label: "Add Rooms" },
    { href: "/my-bookings", label: "My Bookings" },
    { href: "/my-listings", label: "My Listings" },
  ];
 
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex w-11/12 items-center justify-between p-4 lg:px-8">

        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center justify-center">
            <Image src={"/resource.png"} width={160} height={40} alt="logo"className="h-8 w-auto" />
            <span className="text-2xl font-bold text-blue-600">
              StudyNook
            </span>
          </Link>
        </div>

        {/* Mobile Button */}
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
          {/* Public */}
          {publicLinks.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}

          {/* Private */}
          {user &&
            privateLinks.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}
        </div>

        {/* Auth Section */}
        <div className="hidden md:flex items-center md:flex-1 md:justify-end gap-2">
           <ThemeToggle></ThemeToggle>
          {user ? (
            <>
              <Avatar>
                <Avatar.Image src={user?.image} />
                <Avatar.Fallback>
                  {user?.name?.charAt(0)}
                </Avatar.Fallback>
              </Avatar>

              <Button
                onClick={handleSignOut}
                variant="danger"
                className="rounded-none"
              >
                Logout
              </Button>
            </>
          ) : (
              <>
               
              <NavLink
                href="/login"
                className="rounded-lg bg-indigo-600 py-2 text-white font-bold px-5"
              >
                Login
              </NavLink>
              <NavLink
                href="/register"
                className="rounded-lg bg-indigo-600 py-2 text-white font-bold px-5"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4 shadow-xl">
          <div className="flex flex-col gap-4 text-center font-medium">

            {/* Public */}
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Private */}
            {user &&
              privateLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

            <hr className="border-gray-100" />

            {!user ? (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full rounded-lg bg-indigo-600 py-2 text-white font-bold text-center"
              >
                Login
              </Link>
            ) : (
              <Button
                onClick={handleSignOut}
                className="w-full rounded-lg bg-red-500 text-white"
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;