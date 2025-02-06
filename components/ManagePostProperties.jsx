"use client";
import Cookies from "js-cookie";

import RichTextEditor from "./RichTextEditor";
import WebStoryEditor from "./WebStory";
import { IoMdArrowBack } from "react-icons/io";
import RestOfPostEdit from "./RestOfPostEdit";
import ArticlePostEditComponent from "./ArticlePostEditComponent";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import useAllPostDataStore from "../store/useAllPostDataStore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { validateSlug } from "../util/validateSlug";

function ManagePostProperties() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { allPosts, customisePostData } = useAllPostDataStore();
  const pathname = usePathname();
  const [post, setPost] = useState(null);
  const [live, setLive] = useState(false);
  const [webStory, setWebStory] = useState([]);
  const [chnageStatus, setChnageStatus] = useState("");
  const [publishAtTime, setPublishAtTime] = useState("");
  const [type, setType] = useState("single");

  const [postedIdDraft, setPostedIdDraft] = useState(() => {
    const pathParts = pathname.split("/");
    return pathParts[3] === "new-post" ? "" : pathParts[3];
  });

  const showToast = (message, options = {}) => {
    const toastConfig = {
      position: "top-right",
      autoClose: 3000,

      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    };

    if (options.type === "warning") {
      toast.warn(message, toastConfig);
    } else if (options.type === "error") {
      toast.error(message, toastConfig);
    } else {
      toast.success(message, toastConfig);
    }
  };
  const showSlugError = () => {
    showToast(
      "English Title (Permalink) must not contain special characters such as #, @, &, or *.",
      {
        type: "error",
      }
    );
  };
  const [formData, setFormData] = useState({
    primaryCategory: null,
    additionalCategories: [],
    part: [],
    credits: [],
    focusKeyphrase: "",
  });

  const [formDataPostEdit, setFormDataPostEdit] = useState({
    title: "",
    slug: "",
    summary: "",
    seo_desc: "",
    banner_image: "",
    banner_desc: "",
    banner_caption: "",
    video: "",
    video_caption: "",
  });

  const [htmlContent, setHtmlContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [edting, setEdting] = useState(false);

  const useDebouncedSubmit = (delay = 2000) => {
    const debounceTimeout = useRef(null);

    const debounceSubmit = useCallback(
      (callback) => {
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => {
          callback();
        }, delay);
      },
      [delay]
    );

    return debounceSubmit;
  };

  const debounceSubmit = useDebouncedSubmit();

  // State and handlers
  const htmlContentGrab = (data) => {
    if (htmlContent !== data) {
      setEdting(true);
    }

    setHtmlContent((prev) => {
      const updated = data;
      return updated;
    });
  };

  const htmlJsonGrab = (data) => {
    setEdting(true);

    setWebStory((prev) => {
      const updated = data;
      return updated;
    });
  };

  const handleArticleFromData = (name, value) => {
    setEdting(true);
    setFormDataPostEdit((prev) => {
      const updated = { ...prev, [name]: value };

      return updated;
    });
  };

  const handleChange = (value, field) => {
    setEdting(true);

    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      return updated;
    });
  };

  useEffect(() => {
    if (edting === true) {
      debounceSubmit(() => submitData("draft"));
    }
  }, [formDataPostEdit, htmlContent, webStory, formData]);

  const fetchDataById = async (apiUrl) => {
    try {
      // Replace the URL with the actual endpoint you're fetching from

      // Make the GET request
      const response = await fetch(apiUrl, {
        method: "GET", // Method type is GET for fetching data
        headers: {
          "Content-Type": "application/json", // Optional, depends on the API
        },
      });

      // Check if the response is successful
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch data");
      }

      // Parse the response data
      const data = await response.json();

      return data; // Return the fetched data if needed
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle errors, maybe show an error message to the user
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      const parts = pathname.split("/");
      const type = parts[2];
      const id = parts[3];

      if (id === "new-post") {
        // Reset states for a new post
        setWebStory([]);
        setPost(null);
        setHtmlContent("");
        setFormData({
          primaryCategory: null,
          additionalCategories: [],
          tags: [],
          credits: [],
          focusKeyphrase: "",
        });
        setFormDataPostEdit({
          title: "",
          slug: "",
          summary: "",
          seo_desc: "",
          banner_image: "",
          banner_desc: "",
          banner_caption: "",
          video: "",
          video_caption: "",
        });
        setPublishAtTime(new Date());
      } else {
        // Fetch data for an existing post
        let requiredData = null;

        if (!requiredData) {
          try {
            const data = await fetchDataById(
              `${process.env.NEXT_PUBLIC_API_URL}/content/${id}?${searchParams}`
            );
            if (data && data.article) {
              requiredData = data.article;

              setLive(data.article.isLive && data.article.isLive);
            } else {
              showToast("Data not found", { type: "error" });
              return;
            }
          } catch (error) {
            showToast("Failed to fetch data", { type: "error" });
            console.error("Error fetching data:", error);
            return;
          }
        }

        // Set fetched or locally available data
        setPublishAtTime(
          requiredData.published_at_datetime
            ? requiredData.published_at_datetime
            : requiredData.temp_published_at_datetime || new Date()
        );
        setType(requiredData.type);
        setPost(requiredData);
        setHtmlContent(requiredData.content || "");
        setWebStory(requiredData.web_story || []);
        setFormData({
          primaryCategory: requiredData.primary_category?.[0]
            ? {
                value: requiredData.primary_category[0]._id,
                label: requiredData.primary_category[0].name,
              }
            : null,
          additionalCategories: requiredData.categories
            ? requiredData.categories.map((cat) => ({
                value: cat._id,
                label: cat.name,
              }))
            : [],
          tags: requiredData.tags
            ? requiredData.tags.map((t) => ({
                value: t._id,
                label: t.name,
              }))
            : [],
          credits: requiredData.credits
            ? requiredData.credits.map((credit) => ({
                value: credit._id,
                label: credit.name,
              }))
            : [],
          focusKeyphrase: requiredData.focusKeyphrase || "",
        });
        setFormDataPostEdit({
          title: requiredData.title || "",
          slug: requiredData.slug || "",
          summary: requiredData.summary || "",
          seo_desc: requiredData.seo_desc || "",
          banner_image: requiredData.banner_image || "",
          banner_desc: requiredData.banner_desc || "",
          banner_caption: requiredData.banner_caption || "",
          video: requiredData.video || "",
          video_caption: requiredData.video_caption || "",
        });
      }
    };

    if (pathname) {
      initializeData();
    }
  }, [pathname, allPosts]);

  const submitData = async (status) => {
    try {
      setIsSubmitting(true);
      setChnageStatus(status);
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("No token found. Please login again.");
      }

      // Safely get author ID
      let authorId;
      try {
        const storedId =
          typeof window !== "undefined" ? localStorage.getItem("id") : null;
        if (!storedId) return;
        authorId = storedId ? storedId.replace(/^"(.*)"$/, "$1") : null;

        if (!authorId) {
          throw new Error("No author ID found. Please login again.");
        }
      } catch (e) {
        console.error("Error getting author ID:", e);
        throw new Error("Authentication error. Please login again.");
      }

      const transformedData = {
        primary_category: formData.primaryCategory
          ? [formData.primaryCategory.value]
          : [],
        title: formDataPostEdit.title.trim(),
        summary: formDataPostEdit.summary.trim(),
        type: type,

        live_blog_updates:
          pathname.split("/")[3] === "new-post" ? [] : post.live_blog_updates,

        tags: formData.tags.map((tag) => tag.value),
        categories: formData.additionalCategories.map((cat) => cat.value),
        video: formDataPostEdit.video.trim(),
        video_caption: formDataPostEdit.video_caption,
        isLive: live,
        banner_desc: formDataPostEdit.banner_desc.trim(),
        banner_image: formDataPostEdit.banner_image.trim(),
        credits: formData.credits.map((credit) => credit.value),
        focusKeyphrase: formData.focusKeyphrase.trim(),
        banner_caption: formDataPostEdit.banner_caption,
        content: htmlContent.trim(),

        status: status,

        author: authorId,
        slug: formDataPostEdit.slug.trim().toLowerCase().split(" ").join("-"),
        langue: pathname.split("/")[2],
        seo_desc: formDataPostEdit.seo_desc.trim(),
      };

      if (status === "published") {
        transformedData.published_at_datetime = new Date();
      }

      if (status === "update") {
        transformedData.published_at_datetime = publishAtTime;
      }
      if (status === "draft" || status === "pending_approval") {
        transformedData.temp_published_at_datetime = publishAtTime;
        transformedData.published_at_datetime = null;
      }

      if (pathname && pathname.split("/")[2] === "sort_stories") {
        transformedData.web_story = webStory;
      }

      if (status === "draft") {
        let isCreate = postedIdDraft === "";

        transformedData.status = "draft";

        if (post !== null) {
          if (post.published_at_datetime !== null) {
            transformedData.oldId = post._id;
            transformedData.published_at_datetime = null;
            transformedData.status = "draft";
            setPost((pre) => ({
              ...pre,
              published_at_datetime: null,
              status: "draft",
            }));
            // transformedData.published_at_datetime=null

            isCreate = true;
          }
        }

        const apiUrl = isCreate
          ? `${
              process.env.NEXT_PUBLIC_API_URL
            }/content/create?${searchParams.toString()}`
          : `${
              process.env.NEXT_PUBLIC_API_URL
            }/content/update/${postedIdDraft}?${searchParams.toString()}`;

        const isAnyFieldNonEmpty = Object.entries(transformedData)
          .filter(
            ([key]) => !["author", "status", "type"].includes(key) // Exclude author, status, and type
          )
          .some(
            ([, value]) =>
              value !== "" &&
              value !== null &&
              value !== undefined &&
              !(Array.isArray(value) && value.length === 0)
          );

        if (!isAnyFieldNonEmpty) {
          return; // Prevent server call
        }
        const response = await fetch(apiUrl, {
          method: isCreate ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(transformedData),
        });

        const responseData = await response.json();

        setPublishAtTime(responseData.article.temp_published_at_datetime);

        setPostedIdDraft(responseData.article._id);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message ||
              `Failed to ${isCreate ? "create" : "update"} article`
          );
        }
      } else {
        if (
          !transformedData.credits.length ||
          !transformedData.primary_category.length ||
          !transformedData.slug.trim() ||
          !transformedData.title.trim()
        ) {
          showToast(
            "Please fill Categories, Primary Category, Slug, and Title properly.",
            {
              type: "warning",
            }
          );
          return;
        } else {
          let isCreate = false;

          if (!validateSlug(transformedData.slug)) {
            showSlugError();
            return; // Stop further execution
          }

          const apiUrl = isCreate
            ? `${
                process.env.NEXT_PUBLIC_API_URL
              }/content/create?${searchParams.toString()}`
            : `${process.env.NEXT_PUBLIC_API_URL}${
                status === "published" || status === "update"
                  ? `/admin/post/publish/${postedIdDraft}`
                  : `/content/update/${postedIdDraft}`
              }?${searchParams.toString()}`;

          const response = await fetch(apiUrl, {
            method: isCreate ? "POST" : "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(transformedData),
          });
          toast.success(
            `Article ${
              status === "draft"
                ? "saved as Draft"
                : status === "published"
                ? "published"
                : status === "update"
                ? "updated"
                : status === "pending_approval"
                ? "sent for approval"
                : "has an unknown status"
            }`
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message ||
                `Failed to ${isCreate ? "create" : "update"} article`
            );
          }
          const uploadPostData = await response.json();

          if (
            uploadPostData.article.status === "published" &&
            status === "published"
          ) {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/send`, {
              method: "POST", // Specify the HTTP method
              headers: {
                "Content-Type": "application/json", // Set the content type to JSON
              },
              body: JSON.stringify({
                title: uploadPostData.article.title, // Pass your title here
                featureImage: `${process.env.NEXT_PUBLIC_API_URL_IMG}/${uploadPostData.article.banner_image}`,
                url: `${process.env.NEXT_PUBLIC_API_URL_CLIENT}/${uploadPostData.article.primary_category[0].slug}/${uploadPostData.article.slug}`,
                body: uploadPostData.article.summary.slice(0, 55) + "...",
              }),
            })
              .then((response) => response.json()) // Convert the response to JSON
              .then((data) => {
                // Handle the response data here
                console.log("Success:", data);
              })
              .catch((error) => {
                // Handle errors here
                console.error("Error:", error);
              });
          }
        }
      }

      return;
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
      setChnageStatus("");
    }
  };

  const renderView = () => {
    return (
      <div className="flex gap-6">
        <div className="w-full">
          <div className="w-full">
            <ArticlePostEditComponent
              handleArticleFromData={handleArticleFromData}
              formDataPostEdit={formDataPostEdit}
            />
            {searchParams.toString() === "content=stories" && (
              <WebStoryEditor content={webStory} htmlJsonGrab={htmlJsonGrab} />
            )}

            {searchParams.toString() === "content=content" && (
              <div className="flex gap-4 my-5 justify-center">
                <label
                  className={`cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-lg ${
                    type === "single"
                      ? "border-blue-500 bg-blue-50 w-32"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="contentType"
                    value="single"
                    checked={type === "single"}
                    onChange={() => setType("single")}
                    className="hidden"
                  />
                  <span className="text-gray-800">Self Finished</span>
                </label>

                <label
                  className={`cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-lg ${
                    type === "series"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="contentType"
                    value="series"
                    checked={type === "series"}
                    onChange={() => setType("series")}
                    className="hidden"
                  />
                  <span className="text-gray-800">Series</span>
                </label>
              </div>
            )}
            {searchParams.toString() === "content=content" &&
              type === "single" && (
                <RichTextEditor
                  content={htmlContent}
                  htmlContentGrab={htmlContentGrab}
                />
              )}
            <RestOfPostEdit formData={formData} handleChange={handleChange} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col min-h-screen">
        <div className="sticky top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 shadow-sm">
          <div className="w-full px-4 sm:px-6 py-3">
            <div className="flex gap-4 justify-between">
              <button
                className="border rounded text-zinc-600 text-sm px-3 flex gap-1 items-center"
                onClick={() => router.back()}
              >
                <IoMdArrowBack /> Back
              </button>
              <div>
                <button
                  disabled={isSubmitting}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    isSubmitting
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => submitData("draft")}
                >
                  {chnageStatus === "draft" ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Article Saving... As Draft
                    </span>
                  ) : (
                    "Save as Draft"
                  )}
                </button>

                <button
                  disabled={isSubmitting}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    isSubmitting
                      ? "text-blue-300 cursor-not-allowed"
                      : "text-blue-600 hover:text-blue-800"
                  }`}
                  onClick={() => submitData("pending_approval")}
                >
                  {chnageStatus === "pending_approval" ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Article Sending... For Approval
                    </span>
                  ) : (
                    "Send for Approval"
                  )}
                </button>

                <button
                  disabled={
                    isSubmitting &&
                    typeof window !== "undefined" && // Ensure 'window' is defined
                    window.localStorage && // Ensure 'localStorage' exists
                    (JSON.parse(localStorage.getItem("role"))[0] === "Admin" ||
                      JSON.parse(localStorage.getItem("role"))[0] === "Editor")
                  }
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    isSubmitting
                      ? "text-green-300 cursor-not-allowed"
                      : "text-green-600 hover:text-green-800"
                  }`}
                  onClick={() => submitData("published")}
                >
                  {chnageStatus === "published" ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Article Publishing...
                    </span>
                  ) : (
                    "Publish"
                  )}
                </button>

                <button
                  disabled={
                    isSubmitting &&
                    typeof window !== "undefined" && // Ensure 'window' is defined
                    window.localStorage && // Ensure 'localStorage' exists
                    (JSON.parse(localStorage.getItem("role"))[0] === "Admin" ||
                      JSON.parse(localStorage.getItem("role"))[0] === "Editor")
                  }
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    isSubmitting
                      ? "text-yellow-300 cursor-not-allowed"
                      : "text-yellow-600 hover:text-yellow-800"
                  }`}
                  onClick={() => submitData("update")}
                >
                  {chnageStatus === "update" ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Article Updating...
                    </span>
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 p-6">{renderView()}</div>
      </div>
    </>
  );
}

export default ManagePostProperties;
