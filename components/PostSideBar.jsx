"use client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CiVideoOn } from "react-icons/ci";
import { RiArticleLine } from "react-icons/ri";
import { BsChevronLeft, BsChevronDown, BsChevronUp } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import { usePathname, useSearchParams } from "next/navigation";
import useSidebarStore from "../store/useSidebarStore";
import { useState } from "react";
import { SiContentstack } from "react-icons/si";
import SeriesOfStories from "./SeriesOfStories"
const contentTypes = [
  {
    name: "Content",
    href: [
      { type: "bengali", slug: "/posts/bengali?content=content" },
      { type: "hindi", slug: "/posts/hindi?content=content" },
      { type: "english", slug: "/posts/english?content=content" },
    ],
    icon: <RiArticleLine className="text-lg" />,
  },
  {
    name: "Stories",
    href: [
      { type: "bengali", slug: "/posts/bengali?content=stories" },
      { type: "hindi", slug: "/posts/hindi?content=stories" },
      { type: "english", slug: "/posts/english?content=stories" },
    ],
    icon: <CiVideoOn className="text-lg" />,
  },
];

const PostSideBar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams().toString();
  const { showPostSidebar, togglePostSidebar } = useSidebarStore();
  const [openDropdown, setOpenDropdown] = useState(null); // Track which dropdown is open

  const [activeLang, setActiveLang] = useState("bengali"); // Default active language

  const handleDropdownToggle = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <div className="border-r h-screen">
      <AnimatePresence>
        {showPostSidebar && (
          <motion.div
            className="w-full bg-white h-auto   px-4 py-6 z-45 overflow-hidden"
            initial={{ width: 0, opacity: 0 }}
            animate={{
              width: "100%",
              opacity: 1,
              transition: {
                width: { duration: 0.2, ease: "easeInOut" },
                opacity: { duration: 0.1, ease: "easeInOut" },
              },
            }}
            exit={{
              width: 0,
              opacity: 0,
              transition: {
                width: { duration: 0.2, ease: "easeInOut" },
                opacity: { duration: 0.1, delay: 0.1, ease: "easeInOut" },
              },
            }}
          >
            <div className="h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2 border-b-2 pb-2">
                  Content
                </h2>
                <button
                  onClick={() => togglePostSidebar(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Close sidebar"
                >
                  <BsChevronLeft className="text-xl" />
                </button>
              </div>

              <div className="space-y-1">
                {contentTypes.map((contentType) => {
                  const isDropdownOpen = openDropdown === contentType.name;
                  return (
                    <div key={contentType.name}>
                      <button
                        onClick={() => handleDropdownToggle(contentType.name)}
                        className={`flex items-center justify-between w-full p-2 rounded-lg transition-all duration-200 text-gray-700  hover:bg-gray-50 hover:text-gray-900 ${
                          searchParams.split("=")[1] ==
                          contentType.name.toLocaleLowerCase()
                            ? "bg-yellow-50 shadow text-yellow-800"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className=" rounded-md bg-gray-100 text-gray-500">
                            {contentType.icon}
                          </div>
                          <div className={`text-sm font-bold `}>
                            {contentType.name}
                          </div>
                        </div>
                        <div className="text-gray-500">
                          {isDropdownOpen ? <BsChevronUp /> : <BsChevronDown />}
                        </div>
                      </button>

                      <AnimatePresence>
                        {isDropdownOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className=" space-y-1"
                          >
                            {contentType.href.map((link) => (
                              <Link
                                key={link.slug}
                                href={link.slug}
                                onClick={() => setOpenDropdown(null)} // Close dropdown on click
                                className={`items-center pl-2 hover:bg-zinc-100 rounded  flex gap-2 font-semibold capitalize  py-1 text-sm transition-all duration-200 ${
                                  pathname === link.slug
                                    ? "text-blue-600"
                                    : "text-gray-600 hover:text-gray-900"
                                }`}
                              >
                                <SiContentstack className="text-yellow-700" />

                                {link.type}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
        <div className="px-4 mt-3">
          <h1 className="text-xl pb-2 border-b inline-block">Series</h1>

          <div className="flex gap-3 my-2">
            {["bengali", "hindi", "english"].map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`px-2  rounded shadow transition-all capitalize
            ${
              activeLang === lang
                ? "bg-yellow-50 border border-yellow-50 text-yellow-800 "
                : "bg-gray-200 text-gray-800 hover:bg-gray-300 "
            }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <SeriesOfStories langue={activeLang} />
        </div>
      </AnimatePresence>

     
    </div>
  );
};

export default PostSideBar;
