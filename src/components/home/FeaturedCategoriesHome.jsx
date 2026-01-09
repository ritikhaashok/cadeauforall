export default function FeaturedCategoriesHome() {
  const categories = [
    { title: 'Personalized Planters', subtitle: 'Plants with a message' },
    { title: 'Custom Cake Toppers', subtitle: 'Make it extra special' },
    { title: 'Seasonal', subtitle: 'Limited run favorites' },
  ];

  return (
    <section className="mt-12">
      <h2 className="text-center text-2xl font-medium mb-6">Featured Categories</h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
        {categories.map((c) => (
          <div key={c.title} className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="h-40 bg-[var(--beige)] rounded-lg mb-4" />
            <h3 className="font-semibold mb-2">{c.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{c.subtitle}</p>
            <button className="text-sm bg-white border border-gray-200 px-4 py-2 rounded-full">Shop Now</button>
          </div>
        ))}
      </div>
    </section>
  );
}
