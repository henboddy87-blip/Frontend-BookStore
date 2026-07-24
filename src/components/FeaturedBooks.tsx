import { useState } from 'react';
import { ArrowRight as FaArrowRight } from 'lucide-react';
import { Book } from '../types';
import { BookCard } from './BookCard';

interface FeaturedBooksProps {
  books: Book[];
  onBookClick: (book: Book) => void;
  onViewAll: () => void;
}

export function FeaturedBooks({ books, onBookClick, onViewAll }: FeaturedBooksProps) {
  const [tab, setTab] = useState<'bestsellers' | 'new' | 'sale'>('bestsellers');

  const bestsellers = books.filter(b => b.isBestseller);
  const newBooks = books.filter(b => b.isNew);
  const saleBooks = books.filter(b => b.isSale && b.originalPrice);

  const displayed = tab === 'bestsellers' ? bestsellers : tab === 'new' ? newBooks : saleBooks;

  return (
    <section className="py-20 bg-amber-50/50 dark:bg-dark-bg/20 transition-colors duration-500">
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div>
            <span className="text-amber-700 dark:text-amber-500 font-bold text-sm uppercase tracking-widest">Curated Picks</span>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mt-2" style={{ fontFamily: 'Merriweather, serif' }}>Trending Books</h2>
          </div>
          <div className="flex bg-white dark:bg-dark-card rounded-full p-1.5 shadow-sm border border-gray-100 dark:border-white/5">
            {[
              { id: 'bestsellers', label: ' Bestsellers' },
              { id: 'new', label: ' New Arrivals' },
              { id: 'sale', label: ' On Sale' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as typeof tab)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${tab === t.id ? 'bg-amber-800 dark:bg-amber-700 text-white shadow-lg' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {displayed.slice(0, 10).map(book => (
            <BookCard key={book.id} book={book} onBookClick={onBookClick} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button onClick={onViewAll} className="inline-flex items-center gap-3 px-8 py-4 bg-amber-900 text-white rounded-full font-bold hover:bg-amber-800 transition-all group shadow-xl shadow-amber-900/20 cursor-pointer">
            View All Books <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Feature Banner */}
      <div className="max-w-[1600px] mx-auto px-4 mt-20">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-900 to-amber-700">
          <div className="absolute inset-0">
            <img src="https://i.pinimg.com/1200x/16/82/78/168278ef6ef3ec25574bee8eadbc519d.jpg" alt="" className="w-full h-full object-cover opacity-20" />
          </div>
          <div className="relative px-8 md:px-16 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white">
              <span className="text-amber-300 text-sm font-bold uppercase tracking-widest">Reader's Club</span>
              <h3 className="text-3xl md:text-4xl font-black mt-2 mb-3" style={{ fontFamily: 'Merriweather, serif' }}>Get 3 Books for the Price of 2</h3>
              <p className="text-amber-100/80 max-w-lg">Join our Book Club and get exclusive monthly picks, early access to new releases, and member-only discounts. Start your reading journey today.</p>
            </div>
            <div className="flex flex-col gap-4 flex-shrink-0 ">
              <a href="https://media.tenor.com/u6002ayqdi4AAAAM/good-morning.gif" target='_blank' className='w-full'>
                  <button className="px-8 py-4 bg-white text-amber-900 rounded-full font-black hover:bg-amber-50 transition-all shadow-xl whitespace-nowrap cursor-pointer">
                Join Now — Free
              </button>
              </a>
              <p className="text-amber-200 text-sm text-center">No credit card required</p>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll - Most Popular */}
      <div className="max-w-[1600px] mx-auto px-4 mt-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-amber-700 dark:text-amber-500 font-bold text-sm uppercase tracking-widest">Most Reviewed</span>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-1" style={{ fontFamily: 'Merriweather, serif' }}>Reader Favorites</h2>
          </div>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
          {[...books].sort((a, b) => b.reviews - a.reviews).slice(0, 8).map(book => (
            <div key={book.id} className="flex-none w-44 md:w-52">
              <BookCard book={book} onBookClick={onBookClick} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
