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

function SeriesManagePostProperties({child, parent }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Get IDs from props or URL
  const parentsId = parent || pathname.split("/")[2];
  const id = child || pathname.split("/")[3];
  const isNew = id === "new-post";

  // State management
  const [formData, setFormData] = useState({
    parent_id: parentsId,
    title: "",
    slug: "",
    part: 1,
    summary: "",
    credits: [],
    focusKeyphrase: "",
    seo_desc: "",
    content: "",
    status: "draft",
    additionalCategories: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const debounceTimeout = useRef(null);

  // Toast notifications
  const showToast = (message, type = "success") => {
    toast[type](message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  // Fetch series data
  const fetchSeriesData = useCallback(async () => {
    if (id===0)return;

    try {
      const response = await fetch(`${API_URL}/series/${id}`);
      if (!response.ok) throw new Error("Failed to fetch series");
      
      const data = await response.json();
      const series = data.series || data.article; // Handle different response structures

      setFormData({
        parent_id: series.parent_id,
        title: series.title || "",
        slug: series.slug || "",
        part: series.part || 1,
        summary: series.summary || "",
        credits: series.credits?.map(c => ({ value: c._id, label: c.name })) || [],
        focusKeyphrase: series.focusKeyphrase || "",
        seo_desc: series.seo_desc || "",
        content: series.content || "",
        status: series.status || "draft",
        additionalCategories: series.additionalCategories?.map(c => ({ value: c._id, label: c.name })) || []
      });
    } catch (error) {
      showToast(error.message, "error");
      console.error("Fetch error:", error);
    }
  }, [id, isNew, searchParams]);

  // Initialize data
  useEffect(() => {
    fetchSeriesData();
  }, [fetchSeriesData]);

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsEditing(true);
  };

  const handleSelectChange = (selected, field) => {
    setFormData(prev => ({ ...prev, [field]: selected }));
    setIsEditing(true);
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
    setIsEditing(true);
  };

  // Debounced auto-save
  const debounceSubmit = useCallback((callback) => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(callback, 2000);
  }, []);

  useEffect(() => {
    if (isEditing) {
      debounceSubmit(() => submitData("draft"));
    }
  }, [formData, isEditing, debounceSubmit]);

  // Submit handler
  const submitData = async (status) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setCurrentStatus(status);

      // Validate required fields
      if (!formData.parent_id) {
        showToast("Parent series is required", "error");
        return;
      }
      if (!formData.part || formData.part < 1) {
        showToast("Part number must be at least 1", "error");
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

      // Prepare payload
      const payload = {
        ...formData,
        status,
        credits: formData.credits.map(c => c.value),
        additionalCategories: formData.additionalCategories.map(c => c.value),
        slug: formData.slug.trim().toLowerCase().replace(/\s+/g, "-")
      };

      const url = isNew 
        ? `${API_URL}/series/create?${searchParams.toString()}`
        : `${API_URL}/series/update/${id}?${searchParams.toString()}`;
      
      const method = isNew ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Submission failed");
      }

      const result = await response.json();
      const savedSeries = result.series || result.article;

      // Update ID if this was a new post
      if (isNew) {
        router.replace(`/series/edit/${parentsId}/${savedSeries._id}`);
      }

      showToast(
        `Series part ${status === "draft" ? "saved" : status === "published" ? "published" : "updated"} successfully`
      );
      setIsEditing(false);
    } catch (error) {
      showToast(error.message, "error");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
      setCurrentStatus("");
    }
  };

  // Action buttons
  const ActionButton = ({ status, label, color }) => (
    <button
      disabled={isSubmitting}
      className={`px-4 py-2 text-sm font-medium rounded ${
        isSubmitting && currentStatus === status
          ? `bg-${color}-300 cursor-not-allowed`
          : `bg-${color}-600 hover:bg-${color}-700 text-white`
      }`}
      onClick={() => submitData(status)}
    >
      {isSubmitting && currentStatus === status ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      ) : (
        label
      )}
    </button>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ToastContainer />
      
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="px-4 sm:px-6 py-3">
          <div className="flex justify-between items-center">
            <button
              className="flex items-center gap-1 px-3 py-1 border rounded text-gray-600 text-sm"
              onClick={() => router.back()}
            >
              <IoMdArrowBack /> Back
            </button>
            
            <div className="flex gap-2">
              <ActionButton status="draft" label="Save Draft" color="gray" />
              <ActionButton status="pending_approval" label="Submit for Approval" color="blue" />
              <ActionButton status="published" label="Publish" color="green" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Metadata */}
          <div className="lg:col-span-2 space-y-6">
            <SeriesMetadataForm
              formData={formData}
              onChange={handleChange}
            />
            
            {/* Content Editor */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Content</h2>
              <RichTextEditor
                content={formData.content}
                onChange={handleContentChange}
              />
            </div>
          </div>
          
          {/* Right Column - Properties */}
          <div className="space-y-6">
            <SeriesPropertiesForm
              formData={formData}
              onSelectChange={handleSelectChange}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeriesManagePostProperties;