
import { Calendar, User, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface FeaturedPostProps {
  post: {
    title: string;
    excerpt: string;
    author: string;
    date: string;
    category: string;
    readTime: string;
    image: string;
  };
}

export const FeaturedPost = ({ post }: FeaturedPostProps) => {
  const navigate = useNavigate();
  const slug = post.title.toLowerCase().replace(/\s+/g, '-');

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative group cursor-pointer"
      onClick={() => navigate(`/blog/${slug}`)}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 rounded-2xl opacity-0 group-hover:opacity-90 transition-opacity duration-300" />
      <img
        src={post.image}
        alt={post.title}
        className="w-full h-[400px] object-cover rounded-2xl"
      />
      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <div className="relative z-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
            {post.category}
          </span>
          <h2 className="text-3xl font-bold mt-4 mb-2">{post.title}</h2>
          <p className="text-white/80 mb-4">{post.excerpt}</p>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {post.author}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {post.date}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};
