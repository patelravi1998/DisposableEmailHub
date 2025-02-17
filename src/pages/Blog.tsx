
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { motion } from 'framer-motion';
import { FeaturedPost } from '../components/blog/FeaturedPost';
import { BlogPostGrid } from '../components/blog/BlogPostGrid';
import { Newsletter } from '../components/blog/Newsletter';
import { CategoryFilter } from '../components/blog/CategoryFilter';
import { posts } from '../data/blogPosts';

const Blog = () => {
  const categories = ["All", "Security", "Privacy", "Guide", "Tips"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-white">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto space-y-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Our Blog
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Insights and guides about email security, privacy, and digital communication best practices.
            </p>
          </motion.div>

          <CategoryFilter categories={categories} />
          <FeaturedPost post={posts[0]} />
          <BlogPostGrid posts={posts.slice(1)} />
          <Newsletter />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
