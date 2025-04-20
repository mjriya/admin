'use client';  // This tells Next.js that this component should only run in the browser

import useAllSeriesDataStore from '../../../store/useAllSeriesDataStore';
import SeriesTable from '../../../components/SeriesTable';
import SeriesTableHeader from '../../../components/SeriesTableHeader';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const Page = () => {
  const pathname = usePathname();


  const { fetchAllSeriesPostedData, seriesLoading, allSeriesPosts, totalSeriesPages, currentSeriesPage, totalSeriesPostCount } = useAllSeriesDataStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState('published'); // Default status
  const limit = 15;

  const fetchData = () => {

    let url = `${process.env.NEXT_PUBLIC_API_URL}/series/${status}/${pathname.split("/")[2].split("--")[1]}?limit=${limit}&page=${currentPage}`;

    fetchAllSeriesPostedData(url);


  };

  useEffect(() => {
   

    fetchData()
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
          <SeriesTableHeader

            currentPage={currentSeriesPage}
            loading={seriesLoading}
            totalPages={totalSeriesPages}
            onPageChange={handlePageChange}
            onStatusChange={handleStatusChange}
            totalItems={totalSeriesPostCount}
            status={status} // Pass current status
          />
          <div className="overflow-x-auto">
            <SeriesTable
              posts={allSeriesPosts}
              loading={seriesLoading}
              type={pathname.split("/")[2].split("--")[0]}
              status={status}
              fetchData={fetchData}
              parentId={pathname.split("/")[2].split("--")[1]}
              onStatusChange={handleStatusChange} // Optionally pass this to Table for status-specific actions
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
