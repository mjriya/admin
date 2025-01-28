'use client';
import useAllPostDataStore from '../../../store/useAllPostDataStore';
import Table from '../../../components/Table';
import TableHeader from '../../../components/TableHeader';
import React, { useEffect, useState } from 'react';

const Page = () => {
  const { fetchAllPostedData, allPosts, totalPages, loading } = useAllPostDataStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState('published'); // Default status
  const limit = 15;

  // Function to update data when status or page changes
  const fetchData = () => {
    let url;
    if (status === 'pending-approval') {
      url = `${process.env.NEXT_PUBLIC_API_URL}/posts/pending-approval/all?type=Web Story&limit=${limit}&page=${currentPage}`;

    } else {
      url = `${process.env.NEXT_PUBLIC_API_URL}/posts/${status}?type=Gallery&limit=${limit}&page=${currentPage}`;
    }
    fetchAllPostedData(url, 'Gallery');
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, status]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setCurrentPage(1); // Reset to the first page when status changes
  };

  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='max-w-7xl mx-auto p-4'>
        <div className='bg-white rounded-lg shadow'>
          <TableHeader
            type="Gallery"
            currentPage={currentPage}
            loading={loading}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onStatusChange={handleStatusChange}
            totalItems={allPosts.length}
            status={status} // Pass current status
          />
          <div className="overflow-x-auto">
            <Table
              posts={allPosts}
              type={'Gallery'}
              status={status}
              loading={loading}
              onStatusChange={handleStatusChange} // Optionally pass this to Table for status-specific actions
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;




