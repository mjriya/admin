"use client";

import { useEffect, useState } from "react";
import { FaEdit, FaEye,  FaSearch, FaTrash, FaCross } from "react-icons/fa";
import { GoLink } from "react-icons/go";
import { useRouter, usePathname } from "next/navigation";
import CalendarModal from "./CalendarModal";
import { formatDate } from "../util/timeFormat";
import useAllPostDataStore from "../store/useAllPostDataStore";
import LoadingSpinner from "../components/LoadingSpinner";
import { RxUpdate } from "react-icons/rx";
import { useSearchParams } from "next/navigation";
import Cookies from 'js-cookie';

export default function Table({ posts, type, onStatusChange, status ,fetchData}) {
  const searchParams = useSearchParams();

  const {
    loading,
    fetchAllPostedData,
    
  } = useAllPostDataStore();

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useState("");
  const [filter, setFilter] = useState("published");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [postId, setPostId] = useState("");
  const pathname = usePathname();

  // Fetch pending count on mount
  

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
  const handleDelete = async (id) => {

    try {
      const token = Cookies.get("token"); // Get token from cookies
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/article/${id}?${searchParams}`,
        {
          method: "DELETE", // Use DELETE HTTP method
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        }
      );

      if (!response.ok) {
        alert("error");
        throw new Error("Failed to delete the image");
      }
      
      fetchData()
    } catch (error) {
      console.error("Error during delete:", error.message);
    }
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

  return (
    <>
      <>
        <div className=" p-6 rounded-2xl shadow mb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-semibold text-gray-800 capitalize">
                {" "}
                {type}{" "}
              </h2>
              <button
                className="ml-2 bg-yellow-50 shadow text-yellow-800  hover:bg-yellow-600 font-bold  h-8 w-8 rounded-full transition-colors duration-150 flex items-center justify-center "
                onClick={() => {
                  router.push(`/posts/${type}/new-post?${searchParams}`);
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
                      className="search-input px-4 border-0 outline-none focus:outline-none"
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
                filter === "published"
                  ? "border-b-2 border-yellow-600 text-yellow-600 font-medium"
                  : "border-b-2 border-transparent text-gray-600 hover:text-gray-800"
              } transition-all duration-200 pb-3 px-2`}
              onClick={() => {
                setFilter("published"), onStatusChange("published");
              }}
            >
              Published
            </button>
            <button
              className={`${
                filter === "draft"
                  ? "border-b-2 border-yellow-600 text-yellow-600 font-medium"
                  : "border-b-2 border-transparent text-gray-600 hover:text-gray-800"
              } transition-all duration-200 pb-3 px-2`}
              onClick={() => {
                setFilter("draft");
                onStatusChange("draft");
              }}
            >
              Draft
            </button>

            <button
              className={`${
                filter === "PendingApproval"
                  ? "border-b-2 border-yellow-600 text-yellow-600 font-medium"
                  : "border-b-2 border-transparent text-gray-600 hover:text-gray-800"
              } transition-all duration-200 pb-3 px-2 flex items-center gap-2`}
              onClick={() => {
                setFilter("PendingApproval");
                onStatusChange("pending-approval");
              }}
            >
              Pending Approval
             
            </button>
          </div>
        </div>

        {loading === true ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="">
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
                    className="hover:bg-gray-50 transition-colors duration-150 "
                  >
                    <td className="px-4 py-0 ">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-md">
                        {article.title}
                      </div>
                    </td>
                    <td className="px-4 py-1">
                      <div className="text-sm text-gray-500">
                        {article.primary_category && (
                          <div>{article.primary_category?.name}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-1">
                      <div className="text-sm text-gray-500 ">
                        {article.credits?.map((c, i) => (
                          <span key={i}>
                            {c?.name}
                            {i < article.credits?.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 text-center">
                      <div className="text-sm text-gray-500">
                        {article.content && article.content.split(" ").length}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex px-2 text-xs font-medium rounded-full ${
                          article.seoScore === 100
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {10}
                      </span>
                    </td>
                    <td className="px-4 py-1">
                      <div className="text-sm text-gray-500">
                        {status === "pending-approval" ||
                        article.status === "pending-approval"
                          ? formatDate(article.updatedAt || article.createdAt)
                          : article.status === "draft"
                          ? formatDate(article.updatedAt)
                          : formatDate(article.published_at_datetime)}
                      </div>
                    </td>
                    <td className="px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            const url = `https://sportzpoint.com/${article.primary_category[0].slug}/${article.slug}`;
                            window.open(url, "_blank");
                          }}
                          className="p-1 text-gray-600 hover:text-yellow-600 transition-colors duration-150"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            const views = article?.views ?? "0";
                            router.push(
                              `/posts/${type}/${
                                article._id
                              }?${searchParams.toString()}`
                            );
                          }}
                          className="p-1 text-gray-600 hover:text-yellow-600 transition-colors duration-150"
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
                          className="p-1 text-gray-600 hover:text-yellow-600 transition-colors duration-150"
                        >
                          <GoLink className="w-4 h-4" />
                        </button>
                        {article &&
                          article.type &&
                          article.type === "LiveBlog" && (
                            <button
                              onClick={() => pushToLiveContent(article._id)}
                              className="p-1 text-yellow-800 hover:text-red-600 transition-colors duration-150"
                            >
                              <RxUpdate />
                            </button>
                          )}

                        <div className="bg-relative flex  ">
                        {postId=== article._id && 
                            <button
                              
                              className="flex group items-center rounded-tr-none rounded-br-none bg-yellow-50 rounded px-2 text-yellow-800 "
                              onClick={()=>handleDelete(article._id)}
                            >
                              ok
                            </button>
                          }
                           {postId=== article._id ?<button className=" px-1 bg-yellow-50 text-yellow-700 rounded-tr rounded-br "  onClick={() => setPostId(null)}   >
                            x
                           </button>: <button
                            onClick={() => setPostId(article._id)}
                            className="p-1 text-gray-700 hover:text-yellow-600 transition-colors duration-150"
                          >
                            <FaTrash className="w-3 h-3 transition-all duration-100 mr-2" />
                          </button>}

                          

                          
                        </div>
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
