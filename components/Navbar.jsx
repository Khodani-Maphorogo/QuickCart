"use client";

import React from "react";
import { assets, CartIcon, BagIcon } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { BoxIcon, Home } from "lucide-react";
import { Package } from "lucide-react";

const Navbar = () => {
  const { isSeller, router } = useAppContext();
  const { user } = useUser(); 
  const { openSignIn } = useClerk();

  const handleAccountClick = () => {
    openSignIn({});
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push("/")}
        src={assets.logo}
        alt="logo"
      />

   
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">Home</Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">Shop</Link>
        <Link href="/" className="hover:text-gray-900 transition">About Us</Link>
        <Link href="/" className="hover:text-gray-900 transition">Contact</Link>

        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Seller Dashboard
          </button>
        )}
      </div>

     
      <ul className="hidden md:flex items-center gap-4">
        <li>
          <Image
            className="w-4 h-4 cursor-pointer"
            src={assets.search_icon}
            alt="search icon"
            onClick={() => console.log("Search clicked")}
          />
        </li>

        <li>
          {user ? (
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action
                  label="Home"
                  labelIcon={<Home className="w-4 h-4" />}
                  onClick={() => router.push("/")}
                />
                <UserButton.Action
                label="Products"
                labelIcon={<Package className="w-4 h-4" />}
                onClick={() => router.push("/all-products")}
                />

                <UserButton.Action
                  label="Cart"
                  labelIcon={<CartIcon className="w-4 h-4" />}
                  onClick={() => router.push("/cart")}
                />
                <UserButton.Action
                  label="My Orders"
                  labelIcon={<BagIcon className="w-4 h-4" />}
                  onClick={() => router.push("/my-orders")}
                />
              </UserButton.MenuItems>
            </UserButton>
          ) : (
            <button
              onClick={handleAccountClick}
              className="flex items-center gap-2 hover:text-gray-900 transition"
            >
              <Image src={assets.user_icon} alt="user icon" />
              Account
            </button>
          )}
        </li>
      </ul>


      <div className="flex items-center md:hidden gap-3">
        {isSeller && (
          <button
            type="button"
            onClick={() => router.push("/seller")}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Seller Dashboard
          </button>
        )}
        <button
          type="button"
          onClick={handleAccountClick}
          className="flex items-center gap-2 hover:text-gray-900 transition"
        >
          <Image src={assets.user_icon} alt="user icon" />
          Account
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
