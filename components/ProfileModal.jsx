"use client";
import { useState, useRef, useEffect } from "react";
import { FaTimes, FaCamera, FaFacebookF, FaLinkedinIn, FaSignOutAlt } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Image from "next/image";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import TextField from "@mui/material/TextField";
import ImageGalleryPopup from "./ImageGalleryPopup";
import AVATAR from "../public/avatar.png";

const ProfileModal = ({ isOpen, onClose, userData }) => {
  const modalRef = useRef(null);
  const [formData, setFormData] = useState({
    name: userData?.data?.name || "",
    avatar: userData?.data?.profile_picture || "",
    bio: userData?.data?.bio || "",
    twitter: userData?.data?.social_profiles?.twitter || "",
    facebook: userData?.data?.social_profiles?.facebook || "",
    linkedin: userData?.data?.social_profiles?.linkedin || "",
  });
  
  const [imageGallarys, setimageGallarys] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("token");
        const userId = localStorage.getItem("id");
        if (!token || !userId) return;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();

        setFormData({
          name: data.data?.name || "",
          avatar: data.data?.profile_picture || "",
          bio: data.data?.bio || "",
          twitter: data.data.social_profiles?.twitter || "",
          facebook: data.data.social_profiles?.facebook || "",
          linkedin: data.data.social_profiles?.linkedin || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
      }
    };

    fetchUserData();
  }, [isOpen]);

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.clear();
    window.location.href = "/login";
  };

  const selectImage = (img) => {
    setFormData(prev => ({ ...prev, avatar: img }));
    setimageGallarys(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const userId = localStorage.getItem("id");
      if (!token || !userId) throw new Error("Authentication required");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/my-profile/update/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            profile_picture: formData.avatar || "",
            name: formData.name?.trim() || "",
            bio: formData.bio,
            social_profiles: {
              twitter: formData.twitter?.trim() || "",
              facebook: formData.facebook?.trim() || "",
              linkedin: formData.linkedin?.trim() || "",
            },
          }),
        }
      );

      if (!response.ok) throw new Error("Update failed");
      const data = await response.json();
      
      localStorage.setItem("name", data.user.name || "");
      toast.success("Profile updated");
      onClose();
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {imageGallarys && (
        <ImageGalleryPopup onClose={() => setimageGallarys(false)} onSelect={selectImage} />
      )}
      
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div 
          ref={modalRef}
          className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden border border-gray-200"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-yellow-700">Edit Profile</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>

          {/* Compact Content */}
          <div className="p-4 overflow-y-auto" style={{ maxHeight: '70vh' }}>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Avatar */}
              <div className="flex justify-center -mt-2 mb-2">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <Image
                      src={formData.avatar ? `${process.env.NEXT_PUBLIC_API_URL_IMG}/${formData.avatar}` : AVATAR}
                      alt="Profile"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                      onError={(e) => e.target.src = AVATAR}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setimageGallarys(true)}
                    className="absolute bottom-0 right-0 bg-yellow-600 p-2 rounded-full text-white hover:bg-yellow-800"
                  >
                    <FaCamera className="text-xs" />
                  </button>
                </div>
              </div>

              {/* Input Fields with Material-UI TextField */}
              <div className="space-y-3">
                <TextField
                  id="name-field"
                  label="Name"
                  variant="standard"
                  fullWidth
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  InputLabelProps={{
                    style: { color: '#000' } // yellow-600
                  }}
                  InputProps={{
                    style: { color: '#000' } // yellow-600
                  }}
                />

                <TextField
                  id="bio-field"
                  label="Bio"
                  variant="standard"
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  InputLabelProps={{
                    style: { color: '#000' } // yellow-600
                  }}
                  InputProps={{
                    style: { color: '#000' } // yellow-600
                  }}
                />

                <div className="space-y-2 pt-2">
                  <div className="flex items-end gap-2">
                    <FaXTwitter className="text-gray-700 mb-1" />
                    <TextField
                      id="twitter-field"
                      label="Twitter URL"
                      variant="standard"
                      fullWidth
                      value={formData.twitter}
                      onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                      InputLabelProps={{
                        style: { color: '#000' } // yellow-600
                      }}
                      InputProps={{
                        style: { color: '#000' } // yellow-600
                      }}
                    />
                  </div>

                  <div className="flex items-end gap-2">
                    <FaFacebookF className="text-gray-700 mb-1" />
                    <TextField
                      id="facebook-field"
                      label="Facebook URL"
                      variant="standard"
                      fullWidth
                      value={formData.facebook}
                      onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                      InputLabelProps={{
                        style: { color: '#000' } // yellow-600
                      }}
                      InputProps={{
                        style: { color: '#000' } // yellow-600
                      }}
                    />
                  </div>

                  <div className="flex items-end gap-2">
                    <FaLinkedinIn className="text-gray-700 mb-1" />
                    <TextField
                      id="linkedin-field"
                      label="LinkedIn URL"
                      variant="standard"
                      fullWidth
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      InputLabelProps={{
                        style: { color: '#000' } // yellow-600
                      }}
                      InputProps={{
                        style: { color: '#000' } // yellow-600
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center text-yellow-700 hover:text-yellow-800"
                >
                  <FaSignOutAlt className="mr-1" />
                  <span>Logout</span>
                </button>
                
                <div className="space-x-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm text-white bg-yellow-600 rounded hover:bg-yellow-800 disabled:opacity-70"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileModal;