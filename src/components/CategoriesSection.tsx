import { books } from '../data/books';
import { CATEGORIES } from '../data/categories';
import { useStore } from '../context/StoreContext';
import { TranslationKey } from '../data/translations';
import { useScrollReveal } from '../hooks/useScrollReveal';
import {
  BookOpen as FaBookOpen,
  Book as FaBook,
  Laptop as FaLaptopCode,
  FlaskConical as FaFlask,
  Sprout as FaSeedling,
  User as FaUserTie,
  Baby as FaChild,
  HeartPulse as FaHeartbeat,
  Coins as FaCoins,
  Palette as FaPalette,
  Lightbulb as FaLightbulb,
  type LucideIcon,
} from 'lucide-react';

interface CategoriesSectionProps {
  onCategoryChange: (id: string) => void;
}

export function CategoriesSection({ onCategoryChange }: CategoriesSectionProps) {
  const { t } = useStore();
  const [headingRef, headingVisible] = useScrollReveal();
  const [gridRef, gridVisible] = useScrollReveal({ threshold: 0.05 });

  const categoryIcons: Record<string, LucideIcon> = {
    literature: FaBookOpen,
    novel: FaBook,
    technology: FaLaptopCode,
    science: FaFlask,
    fiction: FaBookOpen,
    selfHelp: FaSeedling,
    biography: FaUserTie,
    children: FaChild,
    health: FaHeartbeat,
    finance: FaCoins,
    art: FaPalette,
    nonFiction: FaLightbulb,
  };

  return (
    <section className="py-20 bg-white dark:bg-dark-bg">
      <div className="max-w-[1600px] mx-auto px-4">

        {/* Heading */}
        <div ref={headingRef} className={`text-center mb-12 reveal ${headingVisible ? 'revealed' : ''}`}>
          <span className="text-amber-700 dark:text-amber-500 font-bold text-sm uppercase tracking-widest">
            {t('browseByCategory')}
          </span>
          <h2
            className="text-4xl font-black text-gray-900 dark:text-white mt-2"
            style={{ fontFamily: 'Merriweather, serif' }}
          >
            {t('findPerfectRead')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">
            {t('categoryDesc')}
          </p>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {CATEGORIES.map((cat, index) => {
            const count = books.filter(b => b.category === cat.id).length;
            const Icon = categoryIcons[cat.icon] ?? FaBookOpen;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`group relative rounded-2xl overflow-hidden aspect-[4/3] text-left reveal-scale stagger-${index + 1} ${gridVisible ? 'revealed' : ''}`}
              >
                <img
                  src={cat.image}
                  alt={t(cat.label as TranslationKey)}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <span className="text-2xl mb-1 text-white">
                    <Icon />
                  </span>
                  <h3
                    className="text-lg font-black text-white"
                    style={{ fontFamily: 'Merriweather, serif' }}
                  >
                    {t(cat.label as TranslationKey)}
                  </h3>
                  <p className="text-white/70 text-xs">{count} {t('booksCountLabel')}</p>
                  <div className="flex items-center gap-1 mt-2 text-amber-300 text-xs font-semibold group-hover:gap-2 transition-all">
                    {t('shopNow')} →
                  </div>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}