
import { motion } from 'framer-motion';

interface CategoryFilterProps {
  categories: string[];
}

export const CategoryFilter = ({ categories }: CategoryFilterProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-wrap justify-center gap-4"
    >
      {categories.map((category, index) => (
        <button
          key={index}
          className="px-6 py-2 rounded-full bg-white hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-md text-gray-700 font-medium"
        >
          {category}
        </button>
      ))}
    </motion.div>
  );
};
