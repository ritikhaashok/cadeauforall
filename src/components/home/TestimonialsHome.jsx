export default function TestimonialsHome() {
  const testimonials = [
    { id: 1, name: 'Sarah M.', text: 'The personalized planter I ordered exceeded all expectations—beautiful and arrived so quickly.' },
    { id: 2, name: 'David L.', text: 'Cadeau4All made my daughter\'s birthday extra special with a custom cake topper. Perfect!' },
  ];

  return (
    <section className="mt-12">
      <h2 className="text-center text-2xl font-medium mb-6">What Our Customers Say</h2>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-700 mb-4">“{t.text}”</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--sage)] rounded-full flex items-center justify-center text-white">{t.name.split(' ')[0][0]}</div>
              <div className="text-sm">
                <div className="font-semibold">{t.name}</div>
                <div className="text-xs text-gray-500">Verified buyer</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
