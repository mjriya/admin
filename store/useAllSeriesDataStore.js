import { create } from "zustand";
import Cookies from 'js-cookie';

const useAllSeriesDataStore = create((set, get) => ({

   
    allSeriesPosts: [],
    seriesLoading: false,
    error: null,
    totalSeriesPages: 0,
    currentSeriesPage: 1,
    totalSeriesPostCount: 0,





    fetchAllSeriesPostedData: async (url, type) => {
        set((state) => ({
            seriesLoading: state.loading ? state.seriesLoading : true,
            error: null
        }));
        try {
            const token = Cookies.get('token');

            if (!token) {
                throw new Error("No token found in cookies");
            }

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }

            const data = await response.json();
            // If this is a pending approval request, update the pending count
            if (url.includes('pending-approval')) {
                set(() => ({
                    totalSeriesPages: data?.totalPage || 0,
                    currentSeriesPage: data?.currentPage || 1,
                    totalSeriesPostCount: data?.totalPages || 0,
                    pendingApprovalCount: data.pagination?.total || 0,
                    allSeriesPosts: data.parts || [],
                    seriesLoading: false,
                }));
            } else {
                set(() => ({
                    totalSeriesPages: data?.totalPage || 0,
                    currentSeriesPage: data?.currentPage || 1,
                    totalSeriesPostCount: data?.totalPages || 0,
                    allSeriesPosts:data.parts || [],
                    seriesLoading: false,
                }));
            }
        } catch (error) {
            set({ error: error.message, seriesLoading: false });
            console.error("Error fetching data:", error);
        }
    },
    customisePostData: (type, data) => {
        const currentPosts = get().allSeriesPosts; // Use `get` to access the current state

        if (type === 'Add') {
            const newPosts = [...currentPosts, data]; // Add new post to the array
            set({ allSeriesPosts: newPosts }); // Update the state with `set`
        }
    },

}));

export default useAllSeriesDataStore;
