"use client";
import React from "react";
import TextField from "@mui/material/TextField";

const ArticlePostEditComponent = ({
  handleArticleFromData,
  formDataPostEdit,
}) => {
  const handleTitleChange = (e) => {
    handleArticleFromData("title", e.target.value);
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

  return (
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
    </div>
  );
};

export default ArticlePostEditComponent;