import { useState, useEffect, useMemo } from 'react';
import { ArrowRight as FaArrowRight, Star as FaStar } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface HeroProps {
  onShopNow: () => void;
  onCategoryChange: (cat: string) => void;
}

export function Hero({ onShopNow, onCategoryChange }: HeroProps) {
  const { t, isDarkMode } = useStore();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const slides = useMemo(() => [
    {
      badge: t('heroBadge1'),
      title: t('heroTitle1'),
      highlight: t('heroHighlight1'),
      subtitle: t('heroSubtitle1'),
      cta: t('heroCTA1'),
      ctaCat: 'all',
      image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&h=900&fit=crop&q=80',
      featuredBook: {
        cover: '/images/personal-development/1.jpg',
        title: 'The 7 Habits of Highly Effective People',
        author: 'Stephen Covey',
        rating: 4.9,
      }
    },
    {
      badge: t('heroBadge2'),
      title: t('heroTitle2'),
      highlight: t('heroHighlight2'),
      subtitle: t('heroSubtitle2'),
      cta: t('heroCTA2'),
      ctaCat: 'fiction',
      image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1200&h=900&fit=crop&q=80',
      featuredBook: {
        cover: '/images/novel/Picture1.png',
        title: 'ពណ៍ស្វាយ',
        author: 'ស្រីល័ក្ខណា',
        rating: 4.7,
      }
    },
    {
      badge: t('heroBadge3'),
      title: t('heroTitle3'),
      highlight: t('heroHighlight3'),
      subtitle: t('heroSubtitle3'),
      cta: t('heroCTA3'),
      ctaCat: 'self-help',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=900&fit=crop&q=80',
      featuredBook: {
        cover: '/images/finance/9.jpg',
        title: 'The Lean Start Up',
        author: 'Eric Ries',
        rating: 4.8,
      }
    },
    {
      badge: t('heroBadge4'),
      title: t('heroTitle4'),
      highlight: t('heroHighlight4'),
      subtitle: t('heroSubtitle4'),
      cta: t('heroCTA4'),
      ctaCat: 'khmer-literature',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&h=900&fit=crop&q=80',
      featuredBook: {
        cover: '/images/khmer-literature/khmer1.jpg',
        title: 'Kong Hean',
        author: 'The world of stories',
        rating: 4.5,
      }
    },
    {
      badge: t('heroBadge5'),
      title: t('heroTitle5'),
      highlight: t('heroHighlight5'),
      subtitle: t('heroSubtitle5'),
      cta: t('heroCTA5'),
      ctaCat: 'children',
      image: 'https://images.unsplash.com/photo-1514894646058-da39625d0862?w=1200&h=900&fit=crop&q=80',
      featuredBook: {
        cover: '/images/children/9.jpg',
        title: 'The Wild Robot',
        author: 'Peter Brown',
        rating: 4.9,
      }
    },
  ], [t]);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent(p => (p + 1) % slides.length);
        setAnimating(false);
      }, 400);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[current];

  const goTo = (idx: number) => {
    setAnimating(true);
    setTimeout(() => { setCurrent(idx); setAnimating(false); }, 300);
  };

  return (
    <section className="bg-black relative overflow-hidden transition-colors duration-500 pt-12 pb-20 md:pt-20 md:pb-32 min-h-[600px] flex items-center group/hero">
      {/* Cinematic Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={slide.image} 
          alt="Cinematic Background" 
          className={`w-full h-full object-cover opacity-30 blur-sm transition-transform duration-[2000ms] ease-out ${animating ? 'scale-110' : 'scale-100'}`} 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-[#111111]/50" />
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Content (7 cols) */}
          <div className={`lg:col-span-6 xl:col-span-5 transition-all duration-700 ease-out ${animating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 border border-white/20 text-amber-400 text-xs font-bold tracking-widest uppercase mb-6 shadow-sm backdrop-blur-md">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
              {slide.badge}
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.15] mb-6 drop-shadow-lg" style={{ fontFamily: 'Merriweather, serif' }}>
              {slide.title} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                {slide.highlight}
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-gray-300 mb-8 max-w-lg leading-relaxed drop-shadow-md">
              {slide.subtitle}
            </p>

            <div className="flex flex-wrap gap-4 items-center mb-10 md:mb-14">
              <button 
                onClick={() => { onCategoryChange(slide.ctaCat); onShopNow(); }} 
                className="px-8 py-3.5 bg-white hover:bg-gray-100 text-gray-900 rounded-full font-bold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              >
                {slide.cta} <FaArrowRight size={16} />
              </button>
              <button 
                onClick={onShopNow} 
                className="px-8 py-3.5 bg-transparent border-2 border-white/30 hover:border-white text-white rounded-full font-bold transition-colors backdrop-blur-sm"
              >
                {t('viewAllBooks')}
              </button>
            </div>

            {/* Clean Stats */}
            <div className="flex items-center gap-8 md:gap-12 pt-8 border-t border-white/10">
              <div>
                <p className="text-3xl font-black text-white">50K+</p>
                <p className="text-sm font-medium text-gray-400 mt-1">{t('booksAvailable')}</p>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div>
                <p className="text-3xl font-black text-white">200K+</p>
                <p className="text-sm font-medium text-gray-400 mt-1">{t('happyReaders')}</p>
              </div>
            </div>
          </div>

          {/* Right Image Composition (5 cols) */}
          <div className="lg:col-span-6 xl:col-span-7 relative h-full hidden lg:flex items-center justify-center">
            <div className={`relative w-full max-w-[500px] aspect-[4/3] flex items-center justify-center transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${animating ? 'opacity-0 scale-90 translate-y-8' : 'opacity-100 scale-100 translate-y-0'}`}>
              
              {/* Raw floating image without border/card */}
              <img 
                src={slide.image} 
                alt="Featured Presentation" 
                className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] transform -rotate-2 group-hover/hero:rotate-0 group-hover/hero:scale-105 transition-transform duration-700" 
              />
              
            </div>
          </div>
        </div>

        {/* Custom Paginator Lines */}
        <div className="mt-10 lg:absolute lg:bottom-0 lg:left-1/2 lg:-translate-x-1/2 flex justify-center gap-2 w-full lg:w-auto">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current 
                ? 'bg-amber-500 w-8' 
                : 'bg-white/20 w-2 hover:bg-white/40'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}