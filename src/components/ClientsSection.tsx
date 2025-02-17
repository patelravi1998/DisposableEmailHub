export const ClientsSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-12">Our Clients</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
          <img src="/lovable-uploads/62ae5c84-028f-48c3-827d-c27ec753a7ae.png" alt="Client logos" className="max-w-[120px] grayscale hover:grayscale-0 transition-all duration-300" />
          {/* Placeholder logos - in production these would be separate images */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-24 h-8 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  );
};