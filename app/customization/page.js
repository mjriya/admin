'use client';

import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaImage } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { GoGrabber } from "react-icons/go";
import ImageGalleryPopup from '../../components/ImageGalleryPopup';
import Image from 'next/image';
import { MdOutlineSportsHandball } from "react-icons/md";

const CustomizationPage = () => {
  // State for each section
  const [navbarItems, setNavbarItems] = useState([]);
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [homePageLayout, setHomePageLayout] = useState([]);

  // Drag and Drop State
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedOverItem, setDraggedOverItem] = useState(null);
  const [currentDragType, setCurrentDragType] = useState(null);

  // Modal state
  const [activeModal, setActiveModal] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  // Add state for image gallery popup
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [imageGalleryTarget, setImageGalleryTarget] = useState(null);

  // Drag Start Handler
  const handleDragStart = (e, type, index) => {
    setCurrentDragType(type);
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.parentNode);
    e.target.classList.add('opacity-50');
  };

  // Drag Over Handler
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Drag Enter Handler
  const handleDragEnter = (e, index) => {
    e.preventDefault();
    setDraggedOverItem(index);
  };

  // Drag End Handler
  const handleDragEnd = (e) => {
    e.target.classList.remove('opacity-50');

    // Reorder items based on current drag type
    if (draggedItem !== null && draggedOverItem !== null && draggedItem !== draggedOverItem) {
      let updatedItems;
      switch(currentDragType) {
        case 'navbar':
          updatedItems = [...navbarItems];
          const [reorderedNavbarItem] = updatedItems.splice(draggedItem, 1);
          updatedItems.splice(draggedOverItem, 0, reorderedNavbarItem);
          setNavbarItems(updatedItems);
          break;
        
        case 'featured':
          updatedItems = [...featuredCategories];
          const [reorderedFeaturedCategory] = updatedItems.splice(draggedItem, 1);
          updatedItems.splice(draggedOverItem, 0, reorderedFeaturedCategory);
          setFeaturedCategories(updatedItems);
          break;
        
        case 'layout':
          updatedItems = [...homePageLayout];
          const [reorderedLayoutItem] = updatedItems.splice(draggedItem, 1);
          updatedItems.splice(draggedOverItem, 0, reorderedLayoutItem);
          setHomePageLayout(updatedItems);
          break;
      }
    }

    // Reset drag states
    setDraggedItem(null);
    setDraggedOverItem(null);
    setCurrentDragType(null);
  };

  // Function to open image gallery for a specific item
  const openImageGallery = (type, index) => {
    setShowImageGallery(true);
    setImageGalleryTarget({ type, index });
  };

  // Function to handle image selection
  const handleImageSelect = (imageUrl) => {
    if (imageGalleryTarget.type === 'navbar') {
      const updatedNavbarItems = [...navbarItems];
      updatedNavbarItems[imageGalleryTarget.index].icon = imageUrl.replace('https://dmpsza32x691.cloudfront.net/', '');
      setNavbarItems(updatedNavbarItems);
    } else if (imageGalleryTarget.type === 'featured') {
      const updatedFeaturedCategories = [...featuredCategories];
      updatedFeaturedCategories[imageGalleryTarget.index].icon = imageUrl.replace('https://dmpsza32x691.cloudfront.net/', '');
      setFeaturedCategories(updatedFeaturedCategories);
    }
    setShowImageGallery(false);
  };

  // Generic modal for adding/editing items
  const renderModal = (type) => {
    const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const submissionData = {
        ...editingItem,
        label: formData.get('label'),
        slug: formData.get('slug'),
        icon: editingItem.icon ? editingItem.icon.replace('https://dmpsza32x691.cloudfront.net/', '') : null
      };

      if (activeModal === 'navbar') {
        const updatedNavbarItems = [...navbarItems];
        if (editIndex !== null) {
          // Replace item at the original index
          updatedNavbarItems[editIndex] = { ...submissionData, id: Date.now() };
          setNavbarItems(updatedNavbarItems);
        } else {
          // Add new item at the end
          setNavbarItems([...navbarItems, { ...submissionData, id: Date.now() }]);
        }
      } else if (activeModal === 'featured') {
        const updatedFeaturedCategories = [...featuredCategories];
        if (editIndex !== null) {
          // Replace item at the original index without adding an ID
          updatedFeaturedCategories[editIndex] = { 
            icon: submissionData.icon, 
            label: submissionData.label, 
            slug: submissionData.slug 
          };
          setFeaturedCategories(updatedFeaturedCategories);
        } else {
          // Add new item at the end without an ID
          setFeaturedCategories([...featuredCategories, { 
            icon: submissionData.icon, 
            label: submissionData.label, 
            slug: submissionData.slug 
          }]);
        }
      } else if (activeModal === 'layout') {
        const updatedHomePageLayout = [...homePageLayout];
        const layoutItem = { 
          category: { 
            label: formData.get('label'), 
            slug: formData.get('slug') 
          }
        };

        if (editIndex !== null) {
          // Replace item at the original index
          updatedHomePageLayout[editIndex] = layoutItem;
          setHomePageLayout(updatedHomePageLayout);
        } else {
          // Add new item at the end
          setHomePageLayout([...homePageLayout, layoutItem]);
        }
      }

      setActiveModal(null);
      setEditIndex(null);
      setEditingItem(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
        <div className="bg-white p-6 rounded-lg w-96">
          <h2 className="text-xl font-bold mb-4">
            {editingItem ? 'Edit' : 'Add'} {type === 'navbar' ? 'Navbar Item' : type === 'featured' ? 'Featured Category' : 'Home Page Layout'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {type === 'navbar' || type === 'featured' ? (
              <>
                <div className="flex items-center space-x-2">
                  {editingItem.icon ?<Image
                    src={`${editingItem.icon}`}
                    width={24}
                    height={24}
                    priority
                    alt='icon'
                  />:<MdOutlineSportsHandball />}
                  <button
                    type="button"
                    onClick={() => openImageGallery(type, editIndex)}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    <FaImage />
                  </button>
                </div>
                <input
                  type="text"
                  name="label"
                  defaultValue={editingItem?.label || ''}
                  placeholder="Label"
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  name="slug"
                  defaultValue={editingItem?.slug || ''}
                  placeholder="Slug"
                  className="w-full p-2 border rounded"
                  required
                />
              </>
            ) : (
              <>
                <div>
                  <label className="block mb-2">Label</label>
                  <input
                    type="text"
                    name="label"
                    defaultValue={editingItem?.category?.label || ''}
                    placeholder="Label"
                    className="w-full p-2 border rounded"
                  />
                  <label className="block mb-2">Slug</label>
                  <input
                    type="text"
                    name="slug"
                    defaultValue={editingItem?.category?.slug || ''}
                    placeholder="Slug"
                    className="w-full p-2 border rounded mt-2"
                  />
                </div>
              </>
            )}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => { setActiveModal(null); setEditingItem(null); }}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Generic delete handler
  const handleDelete = (type, index) => {
    if (type === 'navbar') {
      setNavbarItems(navbarItems.filter((_, i) => i !== index));
    } else if (type === 'featured') {
      setFeaturedCategories(featuredCategories.filter((_, i) => i !== index));
    } else if (type === 'layout') {
      setHomePageLayout(homePageLayout.filter((_, i) => i !== index));
    }
  };

  // Generic edit handler using index
  const handleEditByIndex = (type, index) => {
    let itemToEdit;
    switch(type) {
      case 'navbar':
        itemToEdit = navbarItems[index];
        setEditIndex(index);
        break;
      case 'featured':
        itemToEdit = featuredCategories[index];
        setEditIndex(index);
        break;
      case 'layout':
        itemToEdit = homePageLayout[index];
        setEditIndex(index);
        break;
      default:
        console.error('Invalid type for editing');
        return;
    }

    setEditingItem(itemToEdit);
    setActiveModal(type);
  };

  const fetchLayoutStructure = async () => {

    try {
      const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/structure`)

      const structure = await data.json();
      setNavbarItems(structure.navbar)
      setFeaturedCategories(structure.featuredCategory)
      setHomePageLayout(structure.homePageLayout)
    } catch (error) {
      console.log(error);
      
    }

  }

  useEffect(() => {
    fetchLayoutStructure()

  }, [])

  // Save all customization data
  const saveCustomization = async () => {
    try {
      const customizationData = {
        navbar: navbarItems,
        featuredCategory: featuredCategories,
        homePageLayout: homePageLayout
      };

      const token = Cookies.get('token');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/customize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(customizationData)
      });

      if (!response.ok) {
        throw new Error('Failed to save customization');
      }

      const result = await response.json();
      setNavbarItems(result.data.navbar)
      setFeaturedCategories(result.data.featuredCategory)
      setHomePageLayout(result.data.homePageLayout)
      alert('Customization saved successfully!');
      return result;
    } catch (error) {
      console.error('Error saving customization:', error);
      alert('Failed to save customization. Please try again.');
    }
  };

  // Render section with drag and drop
  const renderSection = (title, type, items) => (
    <div className="mb-6 p-4 border rounded">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <button 
          onClick={() => { setActiveModal(type); setEditingItem(null); }}
          className="bg-blue-500 text-white px-3 py-1 rounded flex items-center"
        >
          <FaPlus className="mr-2" /> Add
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div 
            key={`${type}-${index}`}
            draggable
            onDragStart={(e) => handleDragStart(e, type, index)}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex items-center justify-between p-3 bg-gray-100 rounded 
              cursor-grab active:cursor-grabbing
              ${draggedOverItem === index ? 'border-2 border-blue-500' : ''}`}
          >
            <div className="flex items-center space-x-3">
              <GoGrabber 
                className="text-gray-500" 
                title="Drag to reorder"
              />
              <span>
                {type === 'navbar' || type === 'featured' 
                  ? item.label 
                  : (item.category?.label || item.tag?.label)}
              </span>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => {
                  setActiveModal(type);
                  setEditingItem(item);
                  setEditIndex(index);
                }}
                className="text-blue-500"
              >
                <FaEdit />
              </button>
              <button 
                onClick={() => handleDelete(type, index)}
                className="text-red-500"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6 mt-10">
      <h1 className="text-2xl font-bold mb-6">Page Customization</h1>
      
      {renderSection('Navbar Items', 'navbar', navbarItems)}
      {renderSection('Featured Categories', 'featured', featuredCategories)}
      {renderSection('Home Page Layout', 'layout', homePageLayout)}

      {activeModal && renderModal(activeModal)}
      {showImageGallery && (
        <ImageGalleryPopup
          onClose={() => setShowImageGallery(false)}
          onImageSelect={handleImageSelect}
        />
      )}
      <div className="flex justify-end mb-4">
        <button 
          onClick={saveCustomization}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Save All Customizations
        </button>
      </div>
    </div>
  );
};

export default CustomizationPage;