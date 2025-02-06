'use client'
import React from 'react';
import Pagination from './Pagination';
import useAllPostDataStore from '../store/useAllPostDataStore';

const TableHeader = ({ totalPages, currentPage, onPageChange, type, loading, status }) => {
  const { totalPostCount, pendingApprovalCount } = useAllPostDataStore();
  
  return (
    <div className=" shadow-sm">
      {/* Main Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">{type} Posts</h2>
            <div className="flex items-center gap-2">
            
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-50 text-yellow-800 shadow">
                {status === 'pending-approval' ? pendingApprovalCount : totalPostCount}
              </span>
            </div>
          </div>

          {/* Right Section - Pagination */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableHeader;