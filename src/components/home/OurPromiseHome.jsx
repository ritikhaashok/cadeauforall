export default function OurPromiseHome() {
  const promises = [
    { title: 'Handcrafted with Care', description: 'Every item is lovingly designed and crafted by skilled artisans.' },
    { title: 'Truly Unique Personalization', description: 'We offer thoughtful customization options that tell your story.' },
    { title: 'Sustainable & Thoughtful', description: 'Materials and packaging chosen to reduce environmental impact.' },
  ];

  return (
    <section className="mt-12 bg-white rounded-xl p-8 shadow-sm">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        {promises.map((p) => (
          <div key={p.title} className="p-4">
            <div className="text-3xl mb-3">✨</div>
            <h4 className="font-semibold mb-2">{p.title}</h4>
            <p className="text-sm text-gray-500">{p.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
