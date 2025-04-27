"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMdArrowBack } from "react-icons/io";
import RichTextEditor from "./RichTextEditor";
import SeriesMetadataForm from "./SeriesMetadataForm";
import SeriesPropertiesForm from "./SeriesPropertiesForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function SeriesManagePostProperties({ child, parent }) {
  const router = useRouter();
  const pathname = usePathname();
  const [htmlContent, setHtmlContent] = useState("");
  const parentsId = parent || pathname.split("/")[3];
  const initialId = child || pathname.split("/")[4];
  const [id, setId] = useState(initialId);
  const isNewPost = initialId === "0";
  const [isInitialized, setIsInitialized] = useState(false);

  const [formData, setFormData] = useState({
    parent_id: parentsId,
    title: "",
    slug: "",
    part: 1,
    summary: "",
    credits: [],
    focusKeyphrase: "",
    seo_desc: "",
    status: "draft",
    additionalCategories: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const debounceTimeout = useRef(null);

  const showToast = useCallback((message, type = "success") => {
    toast[type](message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }, []);

  const fetchSeriesData = useCallback(async () => {
    if (isNewPost) {
      setIsInitialized(true);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/series/${id}`);
      if (!response.ok) {
        throw new Error(
          response.status === 404
            ? "Series not found"
            : "Failed to fetch series"
        );
      }

      const data = await response.json();
      const series = data || {};

      setHtmlContent(series.content || "");
      console.log("series", series);
      setFormData({
        parent_id: series.parent_id || parentsId,
        title: series.title || "",
        slug: series.slug || "",
        part: series.part || 1,
        summary: series.summary || "",
        credits: series.credits
          ? series.credits.map((credit) => ({
              value: credit._id,
              label: credit.name,
            }))
          : [],
        // credits: series.credits?.map((c) => ({
        //   value: typeof c === "string" ? c : c._id,
        //   label: typeof c === "string" ? c : c.name,
        // })) || [],
        focusKeyphrase: series.focusKeyphrase || "",
        seo_desc: series.seo_desc || "",
        status: series.status || "draft",
        additionalCategories:
          series.additionalCategories?.map((c) => ({
            value: typeof c === "string" ? c : c._id,
            label: typeof c === "string" ? c : c.name,
          })) || [],
      });
      setIsInitialized(true);
    } catch (error) {
      showToast(error.message, "error");
      console.error("Fetch error:", error);
    }
  }, [isNewPost, parentsId, showToast]);

  useEffect(() => {
    if (!isInitialized) {
      fetchSeriesData();
    }
  }, [fetchSeriesData, isInitialized]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsEditing(true);
  }, []);

  const handleSelectChange = useCallback((selected, field) => {
    setFormData((prev) => ({ ...prev, [field]: selected }));
    setIsEditing(true);
  }, []);

  const handleContentChange = useCallback((content) => {
    setHtmlContent(content);
    setIsEditing(true);
  }, []);

  const debounceSubmit = useCallback((callback) => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(callback, 2000);
  }, []);

  useEffect(() => {
    if (isEditing) {
      debounceSubmit(() => {
        submitData("draft");
      });
    }

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [formData, htmlContent, isEditing, debounceSubmit]);
 
  const submitData = async (status) => {
    if (isSubmitting || !isInitialized) return;

    try {
      setIsSubmitting(true);
      setCurrentStatus(status);

      if (!formData.parent_id) {
        showToast("Parent series is required", "error");
        return;
      }
      if (!formData.title.trim()) {
        showToast("Title is required", "error");
        return;
      }

      const token = Cookies.get("token");
      if (!token) {
        showToast("Please login again", "error");
        return;
      }

      const payload = {
        parent_id: formData.parent_id,
        title: formData.title,
        slug: formData.slug.trim().toLowerCase().replace(/\s+/g, "-"),
        summary: formData.summary,
        credits: formData.credits.map((c) => c.value),
        focusKeyphrase: formData.focusKeyphrase,
        seo_desc: formData.seo_desc,
        content: htmlContent,
        status: status,
        additionalCategories: formData.additionalCategories.map((c) => c.value),
      };

      if (isNewPost) {
        payload.part = formData.part;
      }

      const url =
        (isNewPost && id === "0")
          ? `${API_URL}/series/${parentsId}`
          : `${API_URL}/series/update/${id}`;


      const method = (isNewPost && id === "0") ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Submission failed");
      }

      const result = await response.json();
      const savedSeries = result.series || result.article;
      console.log("savedSeries", savedSeries);
      if (isNewPost) {
        setId(savedSeries._id);
        setFormData(prevFormData => ({
          ...prevFormData,
          part: savedSeries.part
        }));
      }
      if (status !== "draft") {
        showToast(
          `Series part ${
            status === "published" ? "published" : "submitted for approval"
          } successfully`
        );
      }

      setIsEditing(false);
    } catch (error) {
      showToast(error.message, "error");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
      setCurrentStatus("");
    }
  };

  const ActionButton = ({ status, label, color }) => {
    const colorMap = {
      gray: {
        enabled: "bg-gray-600 hover:bg-gray-700",
        disabled: "bg-gray-300",
      },
      blue: {
        enabled: "bg-blue-600 hover:bg-blue-700",
        disabled: "bg-blue-300",
      },
      green: {
        enabled: "bg-green-600 hover:bg-green-700",
        disabled: "bg-green-300",
      },
    };

    const isProcessing = isSubmitting && currentStatus === status;

    return (
      <button
        disabled={isSubmitting}
        className={`px-4 py-2 text-sm font-medium rounded text-white ${
          isProcessing ? colorMap[color].disabled : colorMap[color].enabled
        }`}
        onClick={() => submitData(status)}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
            Processing...
          </span>
        ) : (
          label
        )}
      </button>
    );
  };

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ToastContainer />

      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="px-4 sm:px-6 py-3">
          <div className="flex justify-between items-center">
            <button
              className="flex items-center gap-1 px-3 py-1 border rounded text-gray-600 text-sm hover:bg-gray-50"
              onClick={() => router.back()}
            >
              <IoMdArrowBack /> Back
            </button>

            <div className="flex gap-2">
              <ActionButton status="draft" label="Save Draft" color="gray" />
              <ActionButton
                status="pending_approval"
                label="Submit for Approval"
                color="blue"
              />
              <ActionButton status="published" label="Publish" color="green" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-6">
        
          <div className="flex flex-col gap-4">
            <SeriesMetadataForm formData={formData} onChange={handleChange} />

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Content</h2>
              <RichTextEditor
                key={id} // Ensure fresh instance when ID changes
                content={htmlContent}
                htmlContentGrab={handleContentChange}
              />
            </div>
            <div className="">
            <SeriesPropertiesForm
              formData={formData}
              onSelectChange={handleSelectChange}
              onChange={handleChange}
              isNewPost={isNewPost}
            />
          </div>
          </div>

         
       
      </div>
    </div>
  );
}

export default SeriesManagePostProperties;
