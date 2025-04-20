'use client';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ text = 'Loading' }) => {
  const bounceTransition = {
    y: {
      duration: 0.4,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeOut"
    }
  };

  const letters = text.toUpperCase().split(""); // ['L', 'O', 'A', 'D', 'I', 'N', 'G']

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      <div className="flex gap-2">
        {letters.map((letter, index) => (
          <motion.div
            key={index}
            animate={{ y: ["0%", "-50%"] }}
            transition={{
              ...bounceTransition.y,
              delay: index * 0.1
            }}
            className="w-4 h-4 flex text-sm font-thin items-center justify-center bg-yellow-100 border border-yellow-800 rounded text-yellow-900 px-2 py-1 shadow-md"
          >
            {letter}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;
