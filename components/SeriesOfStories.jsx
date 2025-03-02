import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaAngleLeft,FaAngleRight } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import useSidebarStore from '../store/useSidebarStore';
import Link from 'next/link';
const SeriesOfStories = ({ langue }) => {
    const { showPostSidebar, togglePostSidebar } = useSidebarStore();
    
    const [series, setSeries] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchSeries = async (option) => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/series/article`, {
                params: {
                    langue,
                    search,
                    page,
                    limit: 10
                }
            });
            
            
            setSeries(response.data.series);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
            
        } catch (error) {
            console.error('Error fetching series:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSeries();
       
    }, [langue, search, page]);

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleSearchKeyDown = (event) => {
        if (event.key === 'Enter') {
            setPage(1); // Reset to the first page on search
        }
    };

    const handlePagination = (newPage) => {
        setPage(newPage);
    };
    return (
        <div>
            <input
                type="text"
                placeholder="Search for series..."
                value={search}
                onChange={handleSearchChange}
                className="border-zinc-300 rounded border outline-none w-full px-3 py-1  mb-4"
            />

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className='flex flex-col justify-between'>
                    <div className='h-[330px] text-zinc-700 flex flex-col w-full justify-start gap-1 '>
                        {series.map((article) => (
                            <Link href={`/series/${article._id}`} key={article._id}  className=' text-start px-2 border-b border-yellow-800  rounded transition-all duration-200 hover:bg-zinc-100'  >
                                <h3>{article.title.slice(0,20)}...</h3>
                               
                            </Link>
                        ))}
                    </div>

                    <div className='flex items-center gap-2'>
                    <span>
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePagination(page - 1)}
                            disabled={page <= 1}
                            className="text-zinc-400"
                        >
                            <FaAngleLeft/>
                        </button>

                        <div className='bg-yellow-50 text-yellow-800 px-2 shadow-md '>
                            {currentPage}
                        </div>
                        
                        <button
                            onClick={() => handlePagination(page + 1)}
                            disabled={page >= totalPages}
                            className="text-zinc-400 "
                        >
                            <FaAngleRight />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeriesOfStories;
