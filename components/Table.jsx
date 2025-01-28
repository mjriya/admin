"use client";

import { useEffect, useState } from "react";
import { FaEdit, FaEye, FaEllipsisV, FaSearch } from "react-icons/fa";
import { GoLink } from "react-icons/go";
import { useRouter, usePathname } from "next/navigation";
import CalendarModal from "./CalendarModal";
import { formatDate } from "../util/timeFormat";
import useAllPostDataStore from "../store/useAllPostDataStore";
import LoadingSpinner from "../components/LoadingSpinner";
import ActionMenu from "../components/ActionMenu";
import { RxUpdate } from "react-icons/rx";
import Cookies from "js-cookie";

export default function Table({ posts, type, onStatusChange, status }) {
  const {
    loading,
    fetchAllPostedData,
    pendingApprovalCount,
    customiseLivePostData,
    fetchPendingCount,
  } = useAllPostDataStore();

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useState("");
  const [filter, setFilter] = useState("Published");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [postId, setPostId] = useState("");
  const pathname = usePathname();

  // Fetch pending count on mount
  useEffect(() => {
    fetchPendingCount(type);
  }, [type]);

  // Add debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/articles/search?title=${searchQuery}&type=${type}&status=${status}&page=1&limit=15`;
      fetchAllPostedData(apiUrl);
    }, 600);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleDateRangeChange = ({ startDate, endDate }) => {
    // Handle the date range selection here
    // Update your table data based on the selected date range
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/content/search?title=${searchQuery}&type=${type}&status=${status}&page=1&limit=15`;
    fetchAllPostedData(apiUrl);
  };

  // const pushToLiveContent = async (id) => {
  //   try {
  //     const token = Cookies.get("token"); // Get token from cookies

  //     if (!token) {
  //       throw new Error("Authorization token not found");
  //     }

  //     const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/article/update/${id}`;

  //     const response = await fetch(apiUrl, {
  //       method: "PUT", // Use PATCH for partial updates
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
  //       },
  //       body: JSON.stringify({ isLive: true }), // Send isLive: true in the request body
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || "Failed to update content");
  //     }

  //     const responseData = await response.json();
  //     customiseLivePostData("Add", responseData.article);
  //   } catch (error) {
  //     console.error("Error publishing content:", error.message);
  //     // Handle error (e.g., show an error message to the user)
  //   }
  // };

  return (
    <>
      <>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-semibold text-gray-800 capitalize"> {type} </h2>
              <button
                className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-medium h-8 w-8 rounded-full transition-colors duration-150 flex items-center justify-center shadow-sm"
                onClick={() => {
                  router.push(`/posts/${type}/new-post`);
                }}
              >
                +
              </button>
            </div>
            <div className="flex items-center gap-4">
              <form className="border rounded" onSubmit={handleSubmit}>
                <div className="search-bar flex">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="search-input px-4 py-1 border-0 outline-none focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="search-icon px-2 py-2 border-0 border-l"
                  >
                    <FaSearch className="text-gray-400" />
                  </button>
                </div>
              </form>

              <CalendarModal onApply={handleDateRangeChange} />
            </div>
          </div>

          <div className="flex mt-6 border-b gap-6 ">
            <button
              className={`${
                filter === "Published"
                  ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                  : "border-b-2 border-transparent text-gray-600 hover:text-gray-800"
              } transition-all duration-200 pb-3 px-2`}
              onClick={() => {
                setFilter("Published"), onStatusChange("published");
              }}
            >
              Published
            </button>
            <button
              className={`${
                filter === "Draft"
                  ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                  : "border-b-2 border-transparent text-gray-600 hover:text-gray-800"
              } transition-all duration-200 pb-3 px-2`}
              onClick={() => {
                setFilter("Draft");
                onStatusChange("draft");
              }}
            >
              Draft
            </button>

            <button
              className={`${
                filter === "PendingApproval"
                  ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                  : "border-b-2 border-transparent text-gray-600 hover:text-gray-800"
              } transition-all duration-200 pb-3 px-2 flex items-center gap-2`}
              onClick={() => {
                setFilter("PendingApproval");
                onStatusChange("pending-approval");
              }}
            >
              Pending Approval
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
                {pendingApprovalCount}
              </span>
            </button>
          </div>
        </div>

        {loading === true ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categories
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credits
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Word Count
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SEO Score
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timeline
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts?.map((article, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-md">
                        {article.title}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-500">
                        {article.primary_category?.map((e, i) => (
                          <div key={i}>
                            {e?.name}
                            {i < article?.primary_category.length - 1 && ", "}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-500">
                        {article.credits?.map((c, i) => (
                          <span key={i}>
                            {c?.name}
                            {i < article.credits?.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="text-sm text-gray-500">
                        {article.content && article.content.split(" ").length}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          article.seoScore === 100
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {10}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-500">
                       
                        {status === "pending-approval" ||
                        article.status === "pending-approval"
                          ? formatDate(article.updatedAt || article.createdAt)
                          : article.status === "draft"
                          ? formatDate(article.updatedAt)
                          : formatDate(article.published_at_datetime)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            const url = `https://sportzpoint.com/${article.primary_category[0].slug}/${article.slug}`;
                            window.open(url, "_blank");
                          }}
                          className="p-1 text-gray-600 hover:text-blue-600 transition-colors duration-150"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            const views = article?.views ?? "0";
                            router.push(`/posts/${type}/${article._id}`);
                          }}
                          className="p-1 text-gray-600 hover:text-blue-600 transition-colors duration-150"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            const url = `${process.env.NEXT_PUBLIC_API_URL2}/${article.primary_category[0].slug}/${article.slug}`;
                            navigator.clipboard
                              .writeText(url)
                              .then(() => {
                                alert("Copied");
                              })
                              .catch((err) => {
                                alert("Failed to copy!");
                              });
                          }}
                          className="p-1 text-gray-600 hover:text-blue-600 transition-colors duration-150"
                        >
                          <GoLink className="w-4 h-4" />
                        </button>
                        {article &&
                          article.type &&
                          article.type === "LiveBlog" && (
                            <button
                              onClick={() => pushToLiveContent(article._id)}
                              className="p-1 text-red-600 hover:text-red-600 transition-colors duration-150"
                            >
                              <RxUpdate />
                            </button>
                          )}

                        {typeof window !== "undefined" &&
                          JSON.parse(localStorage.getItem("role"))[0] === "Admin"&& (
                            <div className="bg-relative">
                              <button
                                onClick={() => setPostId(article._id)}
                                className="p-1 text-red-600 hover:text-red-600 transition-colors duration-150"
                              >
                                D
                              </button>

                              {postId === article._id && (
                                <ActionMenu
                                  status={filter}
                                  id={article._id}
                                  type={article.type}
                                />
                              )}
                            </div>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    </>
  );
}
