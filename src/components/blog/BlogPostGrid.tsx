
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Post {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
}

interface BlogPostGridProps {
  posts: Post[];
}

export const BlogPostGrid = ({ posts }: BlogPostGridProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post, index) => {
        const slug = post.title.toLowerCase().replace(/\s+/g, '-');
        
        return (
          <motion.article 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden cursor-pointer"
            onClick={() => navigate(`/blog/${slug}`)}
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <span className="absolute bottom-4 left-4 px-3 py-1 bg-white/90 rounded-full text-sm text-primary font-medium">
                {post.category}
              </span>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User className="w-4 h-4" />
                  {post.author}
                </div>
                <div className="flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
};
