"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdOutlinePermMedia,
} from "react-icons/md";
import { IoPricetagsOutline } from "react-icons/io5";
import { RiMapPinRangeFill } from "react-icons/ri";

import { TbCategoryPlus } from "react-icons/tb";
import React, { useState } from "react";
import Link from "next/link";
import { FaHome, FaRegEdit, FaUsers, FaCog } from "react-icons/fa";
import { motion } from "framer-motion";
import useSidebarStore from "../store/useSidebarStore";

const Sidebar = () => {
  const { collapsed, toggleSidebar, togglePostSidebar } = useSidebarStore();
  const [option, setOption] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/posts/")) {
      togglePostSidebar(true);
    } else if (pathname.startsWith("/series/")) {
      togglePostSidebar(true);
    } else {
      togglePostSidebar(false);
    }
  }, [pathname, togglePostSidebar]);

  const handlePostsClick = () => {
    togglePostSidebar(true);
    toggleSidebar(true);
  };

  const menuItems = [
    {
      name: "Home",
      icon: FaHome,
      link: "/#",
      onClick: () => togglePostSidebar(false),
    },
    {
      name: "Content",
      icon: FaRegEdit,
      link: "/posts/bengali?content=content",
      onClick: handlePostsClick,
    },
    {
      name: "Gallery",
      icon: MdOutlinePermMedia,
      link: "/gallery",
      onClick: () => togglePostSidebar(false),
    },
    {
      name: "Categories",
      icon: TbCategoryPlus,
      link: "/categories",
      onClick: () => togglePostSidebar(false),
    },
    {
      name: "Configuration",
      icon: FaCog,
      link: "/configuration",
      onClick: () => togglePostSidebar(false),
    },
    {
      name: "Team",
      icon: FaUsers,
      link: "/team",
      onClick: () => togglePostSidebar(false),
    },
  ].map((item) => ({
    ...item,
    onClick: item.onClick || (() => togglePostSidebar(false)),
  }));

  return (
    <div
      className={`flex flex-col z-40 justify-between h-[95vh] top-11 fixed bg-white border-r transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Menu Items */}
      <ul className={`mt-4 space-y-2 px-2`}>
        {menuItems.map((item, index) => (
          <li
            key={index}
            className="relative"
            onMouseEnter={() => setOption(item.name)}
            onMouseLeave={() => setOption("")}
          >
            <Link href={item.link} onClick={item.onClick}>
              <div
                className={`flex items-center gap-4 px-4 py-2 text-gray-700 rounded hover:bg-yellow-50 hover:text-yellow-800 ${
                  collapsed ? "justify-center" : "justify-start"
                }`}
              >
                <div className="text-xl hover:text-yellow-800">
                  <item.icon size={16} />
                </div>
                <span
                  className={`transition-opacity duration-300 ${
                    collapsed ? "hidden w-0 overflow-hidden" : "opacity-100"
                  }`}
                >
                  {item.name}
                </span>
              </div>
              {/* Tooltip with animation */}
              {collapsed && option === item.name && (
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  exit={{ x: "-100%" }}
                  className="absolute bottom-0 start-16 px-2 tracking-wider bg-black text-white font-thin text-xs p-1 rounded shadow-md"
                >
                  {option}
                </motion.div>
              )}
            </Link>
          </li>
        ))}
      </ul>
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => toggleSidebar(!collapsed)}
        className="p-4 text-gray-500 hover:text-gray-700"
        aria-label="Toggle Sidebar"
      >
        {collapsed ? (
          <MdKeyboardArrowRight size={26} color="black" />
        ) : (
          <div className="flex justify-center gap-1">
            <MdKeyboardArrowLeft size={25} color="black" /> Collapse
          </div>
        )}
      </button>
    </div>
  );
};

export default Sidebar;
