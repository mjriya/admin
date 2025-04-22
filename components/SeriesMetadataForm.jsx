"use client";
import TextField from "@mui/material/TextField";

const SeriesMetadataForm = ({ formData, onChange }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Metadata</h2>
      
      <div className="space-y-4">
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={formData.title}
          onChange={onChange}
          variant="outlined"
          required
        />
        
        <TextField
          fullWidth
          label="Slug (URL)"
          name="slug"
          value={formData.slug}
          onChange={onChange}
          variant="outlined"
          helperText="Only lowercase letters, numbers, and hyphens"
        />
        
        <TextField
          fullWidth
          label="Summary"
          name="summary"
          value={formData.summary}
          onChange={onChange}
          variant="outlined"
          multiline
          rows={3}
          inputProps={{ maxLength: 250 }}
          helperText={`${formData.summary.length}/250 characters`}
        />
        
        <TextField
          fullWidth
          label="SEO Description"
          name="seo_desc"
          value={formData.seo_desc}
          onChange={onChange}
          variant="outlined"
          multiline
          rows={3}
          inputProps={{ maxLength: 160 }}
          helperText={`${formData.seo_desc.length}/160 characters`}
        />
      </div>
    </div>
  );
};

export default SeriesMetadataForm;