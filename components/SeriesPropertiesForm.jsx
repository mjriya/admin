"use client";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import TextField from "@mui/material/TextField";
import useDropDownDataStore from "../store/dropDownDataStore";

const Select = dynamic(() => import("react-select"), { ssr: false });

const SeriesPropertiesForm = ({ formData, onChange, onSelectChange }) => {
  const { allCategory, allRoleBaseUser, fetchDropDownData } = useDropDownDataStore();

  useEffect(() => {
    fetchDropDownData(`${process.env.NEXT_PUBLIC_API_URL}/category`, "category");
    fetchDropDownData(`${process.env.NEXT_PUBLIC_API_URL}/user`, "roleBaseUser");
  }, [fetchDropDownData]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Series Properties</h2>
      
      <div className="space-y-4">
        <TextField
          fullWidth
          type="number"
          label="Part Number"
          name="part"
          value={formData.part}
          onChange={onChange}
          variant="outlined"
          inputProps={{ min: 1 }}
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Credits
          </label>
          <Select
            isMulti
            options={allRoleBaseUser.map(u => ({ value: u._id, label: u.name }))}
            value={formData.credits}
            onChange={(selected) => onSelectChange(selected, "credits")}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Categories
          </label>
          <Select
            isMulti
            options={allCategory.map(c => ({ value: c._id, label: c.name }))}
            value={formData.additionalCategories}
            onChange={(selected) => onSelectChange(selected, "additionalCategories")}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>
        
        <TextField
          fullWidth
          label="Focus Keyphrase"
          name="focusKeyphrase"
          value={formData.focusKeyphrase}
          onChange={onChange}
          variant="outlined"
        />
      </div>
    </div>
  );
};

export default SeriesPropertiesForm;