
import { useParams } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Calendar, User, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { posts } from '../data/blogPosts';

const BlogPost = () => {
  const { slug } = useParams();
  
  // Find the post from our data
  const post = posts.find(p => p.title.toLowerCase().replace(/\s+/g, '-') === slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-white">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.article 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-3xl mx-auto"
        >
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-[400px] object-cover rounded-2xl mb-8"
          />
          
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
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

            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </motion.article>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPost;
