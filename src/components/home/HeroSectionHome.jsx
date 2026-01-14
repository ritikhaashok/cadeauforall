import Link from 'next/link';

export default function HeroSectionHome() {
  return (
    <section className="bg-[var(--beige-light)] rounded-2xl p-8 md:p-12 lg:p-16 shadow-sm">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="w-full">
          {/* <div className="aspect-[4/3] bg-gradient-to-br from-white to-[var(--beige)] rounded-xl overflow-hidden shadow-md flex items-center justify-center">
            <div className="text-center px-4">
               <div className="h-40 w-40 md:h-56 md:w-56 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-300">Image</div>
            </div>
          </div> */}
          <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-md">
            <img
              src="/logo.png"
              alt="Product image"
              className="w-full h-full object-cover"
            />
          </div>

        </div>

        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-sage-dark mb-4">Personalized Gifts, Thoughtfully Crafted</h1>
          <p className="text-gray-600 mb-6">Turn everyday moments into memorable keepsakes with curated, customizable gifts made for the people you care about.</p>
          <div className="flex items-center justify-center md:justify-start gap-4">
            <Link href="/shop" className="inline-block bg-[var(--sage)] text-white px-5 py-2 rounded-full shadow-sm">Explore Our Collection</Link>
            <a className="text-sm text-gray-500" href="#learn">Learn more</a>
          </div>
        </div>
      </div>
    </section>
  );
}
