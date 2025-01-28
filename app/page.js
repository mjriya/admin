"use client";
import { FaRegEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AiOutlinePlus } from "react-icons/ai";
import Link from "next/link";
useDropDownDataStore
import Cookies from "js-cookie";
import useDropDownDataStore from "../store/dropDownDataStore";

const EmptyDrafts = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
    <FaRegEdit className="w-12 h-12 text-gray-300 mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-1">No drafts yet</h3>
    <p className="text-sm text-gray-500 mb-4">
      Get started by creating your first draft
    </p>
    <Link
      href="/content/bengali"
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
    >
      <AiOutlinePlus className="w-4 h-4" />
      Create New Post
    </Link>
  </div>
);

const HomePage = () => {
  const { fetchDropDownData} = useDropDownDataStore();

  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserAndDrafts = async () => {
      try {
        const token = Cookies.get("token");
        const userId = typeof window !== 'undefined' ? localStorage.getItem("id") : null;

        if (!userId) return;

        const userResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!userResponse.ok) throw new Error("Failed to fetch user data");
        const userData = await userResponse.json();
        setUser(userData);

        const draftsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/my-posts?status=draft`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!draftsResponse.ok) throw new Error("Failed to fetch drafts");
        const draftsData = await draftsResponse.json();
        setDrafts(draftsData.posts || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndDrafts();
  }, []);

  useEffect(()=>{
    fetchDropDownData(`${process.env.NEXT_PUBLIC_API_URL}/category`,'category')
    fetchDropDownData(`${process.env.NEXT_PUBLIC_API_URL}/tag`,'tag')
    fetchDropDownData(`${process.env.NEXT_PUBLIC_API_URL}/users`,'roleBaseUser')
  },[])

  return (
    <div className="flex justify-center min-h-screen bg-gray-50 pt-20 pb-6">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Hello, {user?.name || "there"} 👋
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your posts.
          </p>
        </div>

        {/* Drafts Section */}
        <div className="mb-8">
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Drafts
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((skeleton) => (
                <div
                  key={skeleton}
                  className="bg-white p-3 rounded-lg border border-gray-200 animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {drafts.length > 0 ? (
                drafts.map((draft) => (
                  <div
                    key={draft._id}
                    className="bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-500 transition-all duration-200"
                  >
                    <div className="flex items-center gap-1 mb-1.5">
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                        {draft.category}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1.5 line-clamp-2">
                      {draft.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {draft.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <FaRegEdit className="text-gray-400 w-3 h-3" />
                        {draft.lastEdited}
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 font-medium">
                        Edit
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyDrafts />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
