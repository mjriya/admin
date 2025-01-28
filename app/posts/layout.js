'use client'
import PostSideBar from "../../components/PostSideBar";
import useSidebarStore from "../../store/useSidebarStore";
import { BsChevronRight } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

export default function PostsLayout({ children }) {
  const { showPostSidebar, togglePostSidebar } = useSidebarStore();

  return (
    <div className="relative mt-10">
      <div className={`fixed top-10 h-screen overflow-hidden transition-all duration-200 ${showPostSidebar ? 'w-64' : 'w-0'}`}>
        <PostSideBar />
      </div>

      <AnimatePresence>
        {!showPostSidebar && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            onClick={() => togglePostSidebar(true)}
            className="fixed top-12 left-4 p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors z-50 bg-white shadow-sm"
            aria-label="Expand sidebar"
          >
            <BsChevronRight className="text-xl" />
          </motion.button>
        )}
      </AnimatePresence>

      <div className={`transition-all duration-200 ${showPostSidebar ? 'ml-64' : 'ml-0'}`}>
        {children}
      </div>
    </div>
  );
}
