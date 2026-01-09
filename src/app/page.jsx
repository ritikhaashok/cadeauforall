// export default function Home() {
//   return (
//     <main className="min-h-screen bg-beige flex items-center justify-center">
//       <h1 className="text-4xl font-semibold text-sage-dark">
//         Cadeau4All
//       </h1>
//     </main>
//   )
// }
import HeroSectionHome from '@/components/home/HeroSectionHome';
import FeaturedCategoriesHome from '@/components/home/FeaturedCategoriesHome';
import NewArrivalsHome from '@/components/home/NewArrivalsHome';
import OurPromiseHome from '@/components/home/OurPromiseHome';
import TestimonialsHome from '@/components/home/TestimonialsHome';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <main className="px-6 py-12">
        <HeroSectionHome />

        <FeaturedCategoriesHome />

        <NewArrivalsHome />

        <OurPromiseHome />

        <TestimonialsHome />

        <Footer />
      </main>
    </>
  );
}
