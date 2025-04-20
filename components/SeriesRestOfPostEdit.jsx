'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import useDropDownDataStore from '../store/dropDownDataStore';
import TextField from '@mui/material/TextField';

// Dynamically import react-select to avoid SSR issues
const Select = dynamic(() => import('react-select'), {
  ssr: false,
  loading: () => null
});

function SeriesRestOfPostEdit({ formData, handleChange }) {
  const { allCategory, allRoleBaseUser, fetchDropDownData } = useDropDownDataStore();
  
  useEffect(() => {
    fetchDropDownData(`${process.env.NEXT_PUBLIC_API_URL}/category`, 'category');
    fetchDropDownData(`${process.env.NEXT_PUBLIC_API_URL}/user`, 'roleBaseUser');
  }, [fetchDropDownData]);

  const categoryOptions = allCategory.map((cat) => ({
    value: cat._id,
    label: cat.name,
  }));

  const creditOptions = allRoleBaseUser.map((role) => ({
    value: role._id,
    label: role.name,
  }));

  const handleChangeFromData = (value, field) => {
    handleChange(value, field);
  };

  // Common select styles
  const selectStyles = {
    control: (base) => ({
      ...base,
      width: '100%',
      padding: '2px',
      borderColor: '#e5e7eb',
      '&:hover': {
        borderColor: '#3b82f6'
      }
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: '#f3f4f6',
      borderRadius: '4px'
    }),
    placeholder: (base) => ({
      ...base,
      color: '#9ca3af'
    })
  };

  return (
    <div className="w-full rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">Series Properties</h2>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="space-y-2 w-full">
          <TextField
            label="Part Number"
            type="number"
            variant="standard"
            fullWidth
            value={formData.part || ''}
            onChange={(e) => handleChangeFromData(parseInt(e.target.value), 'part')}
            InputLabelProps={{
              style: { color: '#373636' }
            }}
            InputProps={{
              style: { color: '#373636' }
            }}
          />
        </div>

        <div className="space-y-2 w-full">
          <label className="block text-sm font-medium text-gray-700">
            Additional Categories
          </label>
          <Select
            instanceId="additional-categories-select"
            isMulti
            value={formData.additionalCategories}
            onChange={(value) => handleChangeFromData(value, 'additionalCategories')}
            options={categoryOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Select Additional Categories"
            styles={selectStyles}
          />
        </div>

        <div className="space-y-2 w-full">
          <label className="block text-sm font-medium text-gray-700">
            Credits <span className="text-red-500">*</span>
          </label>
          <Select
            instanceId="credits-select"
            isMulti
            value={formData.credits}
            onChange={(value) => handleChangeFromData(value, 'credits')}
            options={creditOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Select Credits"
            styles={selectStyles}
          />
        </div>

        <div className="space-y-2 w-full">
          <TextField
            label="Focus Keyphrase"
            variant="standard"
            fullWidth
            value={formData.focusKeyphrase}
            onChange={(e) => handleChangeFromData(e.target.value, 'focusKeyphrase')}
            InputLabelProps={{
              style: { color: '#373636' }
            }}
            InputProps={{
              style: { color: '#373636' }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default SeriesRestOfPostEdit;