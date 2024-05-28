import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
      <>
        <div className="w-full h-20 bg-slate-400 sticky top-0">
          <div className="container mx-auto px-4 h-full">
            <div className="flex justify-between items-center h-full">
              <ul className="hidden md:flex gap-x-6 text-white">
                <li className="hover:bg-slate-500">
                  <Link href="/">
                    <p>Home</p>
                  </Link>
                </li>
                <li className="hover:bg-slate-500">
                  <Link href="/chat">
                    <p>Chat</p>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </>
  );
};

export default Navbar;