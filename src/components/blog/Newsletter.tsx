
export const Newsletter = () => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm text-center">
      <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
      <p className="text-gray-600 mb-6">
        Get the latest updates and insights delivered directly to your inbox.
      </p>
      <div className="flex gap-4 max-w-md mx-auto">
        <input
          type="email"
          placeholder="Enter your email"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
        />
        <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          Subscribe
        </button>
      </div>
    </div>
  );
};
