'use client';  // This tells Next.js that this component should only run in the browser

import useAllSeriesDataStore from '../../../store/useAllSeriesDataStore';
import Table from '../../../components/Table';
import TableHeader from '../../../components/TableHeader';
import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const Page = () => {
  const pathname = usePathname();  // Gets "/bengali"


  const { fetchAllSeriesPostedData,seriesLoading,allSeriesPosts,totalSeriesPages,currentSeriesPage,totalSeriesPostCount } = useAllSeriesDataStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState('published'); // Default status
  const limit = 15;

  // Function to update data when status or page changes
  const fetchData = () => {

    let url = `${process.env.NEXT_PUBLIC_API_URL}/series/${status}/${pathname.split("/")[2]}?langue=bengali&limit=${limit}&page=${currentPage}`;
    
    fetchAllPostedData(url, 'bengali');


  };

  // useEffect hook ensures fetchData runs only on the client
  useEffect(() => {
    fetchAllSeriesPostedData();
  }, [currentPage, status]);

  // Only execute scroll logic on the client
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (typeof window !== 'undefined') {  // Check if window is defined (client-side only)
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setCurrentPage(1); // Reset to the first page when status changes
  };

  return (
    <div className=' min-h-screen'>
      <div className='max-w-7xl mx-auto p-4'>
        <div className=' rounded-lg shadow'>
          <TableHeader
            type="Bengali"
            currentPage={currentSeriesPage}
            loading={seriesLoading}
            totalPages={totalSeriesPages}
            onPageChange={handlePageChange}
            onStatusChange={handleStatusChange}
            totalItems={totalSeriesPostCount}
            status={status} // Pass current status
          />
          <div className="overflow-x-auto">
            <Table
              posts={allSeriesPosts}
              loading={seriesLoading}
              type={'bengali'}
              status={status}
              fetchData={fetchData}
              onStatusChange={handleStatusChange} // Optionally pass this to Table for status-specific actions
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
