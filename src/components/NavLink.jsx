"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavLink = ({ href, className, children }) => {
  const pathname = usePathname();
  console.log(pathname, "pathname");

  const isActive = href === pathname;

  return (
    <Link
      href={href}
      className={`${isActive ? "text-blue-700 font-bold  border-b-2 border-blue-600 justify-center+" : ""} ${className}`}
    >
      {children}
    </Link>
  );
};

export default NavLink;