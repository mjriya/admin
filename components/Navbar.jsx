"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import ProfileModal from "./ProfileModal";
import Cookies from "js-cookie";

const Navbar = () => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("token");
        const userId = localStorage.getItem("id");

        if (!token || !userId) {
          console.error("No token or userId found");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Response:", response);
        // Check if the response is ok (status code 200-299)
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        console.log("User data:", data);
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);
  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#f7f7f7] z-50">
      <div className="max-w-[2000px] mx-auto">
        <div className="flex items-center justify-between h-10 px-4">
          <Link href="/" className="flex items-center gap-2 my-7">
            <span className="text-[15px] font-medium text-gray-800">MAN</span>
          </Link>

          {/* Profile Section */}
          <div className="flex items-center">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {userData?.profile_picture ? (
                <div className="w-[30px] h-[30px] relative">
                  <Image
                    src={`${userData?.profile_picture}`}
                    alt="Profile"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                    className="rounded-full"
                  />
                </div>
              ) : (
                <FaUserCircle className="w-6 h-6 text-gray-600" />
              )}
              <span className="text-sm font-medium text-gray-700 capitalize">
                {userData?.name || "Loading..."}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {isProfileModalOpen && <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          // Refresh user data when modal closes
          const userId = localStorage.getItem("id");
          if (userId) {
            const token = Cookies.get("token");
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
              .then((res) => res.json())
              .then((data) => setUserData(data))
              .catch(console.error);
          }
        }}
        userData={userData}
      />}
    </nav>
  );
};

export default Navbar;
