"use client";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Image from "next/image";
import ImageGalleryPopup from "./ImageGalleryPopup";

const ArticlePostEditComponent = ({
  handleArticleFromData,
  formDataPostEdit,
}) => {
  const handleTitleChange = (e) => {
    handleArticleFromData("title", e.target.value);
  };
  const [gallery, setGallery] = useState(false);
  const toggleGalleyButton=(value) => {
    setGallery(value);
  };
  const handleBanner_descDescriptionChange = (e) => {
    const value = e.target.value;
    handleArticleFromData("banner_desc", value);
  };

  const handleBanner_caption = (banner_caption) => {
    handleArticleFromData("banner_caption", banner_caption.target.value);
  };
  
  const handleEnglishTitleChange = (e) => {
    handleArticleFromData("slug", e.target.value);
  };

  const handleSummaryChange = (e) => {
    handleArticleFromData("summary", e.target.value);
  };

  const handleMetaDescriptionChange = (e) => {
    handleArticleFromData("seo_desc", e.target.value);
  };
  const selecttedImageForBanner = (filename) => {
    
    handleArticleFromData("banner_image", filename);
  };
  const handleImageAltText = (altText) => {
    handleArticleFromData("banner_desc", altText);
  };
  return (
    <>
    {gallery && (
        <ImageGalleryPopup
        onSelect={selecttedImageForBanner}
        onImageSelect={(url, altText) => {
          selecttedImageForBanner(url);
          handleImageAltText(altText);
          setGallery(false); // Directly close the popup
        }}
        onClose={() => setGallery(false)} // Directly close the popup
      />
      )}
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Title */}
      <div className="mb-4">
        <TextField
          id="title"
          label="Title"
          variant="standard"
          fullWidth
          value={formDataPostEdit.title}
          onChange={handleTitleChange}
          required
          InputLabelProps={{
            style: { color: '#373636' }
          }}
          InputProps={{
            style: { color: '#373636' }
          }}
        />
      </div>

      {/* English Title */}
      <div className="mb-4">
        <TextField
          id="englishTitle"
          label="Custom Url (Permalink)"
          variant="standard"
          fullWidth
          value={formDataPostEdit.slug}
          onChange={handleEnglishTitleChange}
          InputLabelProps={{
            style: { color: '#373636' }
          }}
          InputProps={{
            style: { color: '#373636' }
          }}
        />
        <p className="mt-1 text-sm text-gray-500">
          Only lowercase letters, numbers, and hyphens are allowed.
        </p>
      </div>

      {/* Summary */}
      <div className="mb-4">
        <TextField
          id="summary"
          label="Summary"
          variant="standard"
          fullWidth
          multiline
          rows={3}
          value={formDataPostEdit.summary}
          onChange={handleSummaryChange}
          InputLabelProps={{
            style: { color: '#373636' }
          }}
          InputProps={{
            style: { color: '#373636' }
          }}
        />
        <div className="text-sm text-gray-500 mt-1">
          {formDataPostEdit.summary.length} / 250
        </div>
      </div>

      {/* Meta Description */}
      <div className="mb-4">
        <TextField
          id="metaDescription"
          label="Meta Description"
          variant="standard"
          fullWidth
          multiline
          rows={3}
          value={formDataPostEdit.seo_desc}
          onChange={handleMetaDescriptionChange}
          InputLabelProps={{
            style: { color: '#373636' }
          }}
          InputProps={{
            style: { color: '#373636' }
          }}
        />
        <div className="text-sm text-gray-500 mt-1">
          {formDataPostEdit.seo_desc ? formDataPostEdit.seo_desc.length : 0} / 160
        </div>
      </div>




      <div className="mb-4">
        <label
          htmlFor="featuredImage"
          className="block text-sm font-medium text-gray-700"
        >
          Featured Image
        </label>

       
          <div
            className={`flex items-center justify-center w-full h-40 mt-1 border rounded-md cursor-pointer `}
            onClick={()=>toggleGalleyButton(true)}
          >
            <label
              htmlFor="featuredImage"
              className="flex items-center justify-center w-full h-full"
            >
              {formDataPostEdit.banner_image ? (
                <Image
                  src={`${formDataPostEdit.banner_image}`}
                  alt={formDataPostEdit.banner_desc}
                  width={500}
                  height={400}
                  className="object-cover w-full h-full rounded-md"
                />
              ) : (
                <>
                  <p className="mt-2 text-sm text-gray-500 text-center">
                    Add Featured Image
                    <br />
                    Recommended Size: 1280x720
                  </p>
                </>
              )}
            </label>
          </div>
        
          <div className="flex gap-5">
            <input
              type="text"
              onChange={handleBanner_descDescriptionChange}
              value={formDataPostEdit.banner_desc}
              placeholder="Alt Text"
              className="mt-4 border border-dashed rounded outline-none focus:outline-none px-5 py-1 w-1/2 border-gray-100 bg-gray-100 mx-auto"
            />
            <input
              type="text"
              onChange={handleBanner_caption}
              value={formDataPostEdit.banner_caption}
              placeholder="Banner Caption"
              className="mt-4 border border-dashed rounded outline-none focus:outline-none px-5 py-1 w-1/2 border-gray-100 bg-gray-100 mx-auto"
            />
          </div>
          
        
      </div>
    </div>



</>















    
  );
};

export default ArticlePostEditComponent;