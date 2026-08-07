import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { TranslationKey } from "../data/translations";
import { useScrollReveal } from "../hooks/useScrollReveal";

const SHOP_LINKS: { label: TranslationKey; to: string }[] = [
  { label: "allBooks", to: "/books" },
  { label: "newArrivals", to: "/new-arrivals" },
  { label: "bestsellers", to: "/bestsellers" },
  { label: "onSale", to: "/on-sale" },
  { label: "awardWinners", to: "/award-winners" },
  { label: "bookBundles", to: "/book-bundles" },
];

const GENRE_LINKS: { label: TranslationKey; to: string }[] = [
  { label: "fiction", to: "/genre/fiction" },
  { label: "nonFiction", to: "/genre/non-fiction" },
  { label: "selfHelp", to: "/genre/self-help" },
  { label: "biography", to: "/genre/biography" },
  { label: "children", to: "/genre/children" },
  { label: "scienceFiction", to: "/genre/science" },
];

const HELP_LINKS: { label: TranslationKey; to: string }[] = [
  { label: "faq", to: "/faq" },
  { label: "shippingInfo", to: "/shipping" },
  { label: "returns", to: "/returns" },
  { label: "trackOrder", to: "/track-order" },
  { label: "giftCards", to: "/gift-cards" },
  { label: "contactUs", to: "/contact" },
];

const LEGAL_LINKS: { label: TranslationKey; to: string }[] = [
  { label: "privacyPolicy", to: "/privacy-policy" },
  { label: "termsOfService", to: "/terms-of-service" },
  { label: "cookiePolicy", to: "/cookie-policy" },
  { label: "accessibility", to: "/accessibility" },
];

const PAYMENT_LOGOS = [
  {
    src: "/payment/khqr.png",
    alt: "KHQR",
  },
  {
    src: "/payment/aba.png",
    alt: "ABA",
  },
  {
    src: "/payment/aceleda.png",
    alt: "Aceleda",
  },
  {
    src: "/payment/wing.png",
    alt: "Wing",
  },
];

export function Footer() {
  const { t } = useStore();
  const [footerRef, footerVisible] = useScrollReveal({ threshold: 0.05 });

  return (
    <footer className="bg-amber-50 dark:bg-amber-950 text-amber-900 dark:text-amber-100 border-t border-amber-100 dark:border-amber-900">
      {/* Main Footer */}
      <div className="max-w-[1600px] mx-auto px-4 py-16">
        <div ref={footerRef} className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className={`md:col-span-2 reveal stagger-1 ${footerVisible ? 'revealed' : ''}`}>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 flex items-center justify-center flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span
                className="text-2xl font-black text-amber-900 dark:text-white"
                style={{ fontFamily: "Merriweather, serif" }}
              >
                Khmer
                <span className="text-amber-600 dark:text-amber-400">
                  Bookstore
                </span>
              </span>
            </Link>
            <p className="text-amber-900/70 dark:text-amber-300/70 text-[18px] mb-6 max-w-xs leading-relaxed">
              Your premier online destination for books of every genre.
              Discover, read, and grow with over 50,000 titles.
            </p>
            <div className="flex flex-wrap gap-4">
              {[
                {
                  src: "https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg",
                  href: "https://facebook.com",
                  alt: "Facebook",
                },
                {
                  src: "https://upload.wikimedia.org/wikipedia/commons/b/be/Facebook_Messenger_logo_2020.svg",
                  href: "https://messenger.com",
                  alt: "Messenger",
                },
                {
                  src: "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg",
                  href: "https://t.me",
                  alt: "Telegram",
                },
                {
                  src: "https://static.vecteezy.com/system/resources/thumbnails/016/716/450/small/tiktok-icon-free-png.png",
                  href: "https://tiktok.com",
                  alt: "TikTok",
                },
                {
                  src: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg",
                  href: "https://instagram.com",
                  alt: "Instagram",
                },
                {
                  src: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg",
                  href: "https://youtube.com",
                  alt: "YouTube",
                },
              ].map(({ src, href, alt }) => (
                <a
                  key={alt}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${alt}`}
                  className="w-10 h-10 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center hover:scale-110 transition-all shadow-lg p-2 border border-amber-100 dark:border-white/5"
                >
                  <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div className={`reveal stagger-3 ${footerVisible ? 'revealed' : ''}`}>
            <h4
              className="font-bold text-[22px] text-amber-950 dark:text-white mb-5"
              style={{ fontFamily: "Merriweather, serif" }}
            >
              {t("shop")}
            </h4>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-amber-900/60 dark:text-amber-300/70 hover:text-amber-700 dark:hover:text-amber-200 transition-colors text-[18px]"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Genres */}
          <div className={`reveal stagger-5 ${footerVisible ? 'revealed' : ''}`}>
            <h4
              className="font-bold text-[22px] text-amber-950 dark:text-white mb-5"
              style={{ fontFamily: "Merriweather, serif" }}
            >
              {t("genres")}
            </h4>
            <ul className="space-y-2.5">
              {GENRE_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-amber-900/60 dark:text-amber-300/70 hover:text-amber-700 dark:hover:text-amber-200 transition-colors text-[18px]"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div className={`reveal stagger-7 ${footerVisible ? 'revealed' : ''}`}>
            <h4
              className="font-bold text-[22px] text-amber-950 dark:text-white mb-5"
              style={{ fontFamily: "Merriweather, serif" }}
            >
              {t("help")}
            </h4>
            <ul className="space-y-2.5">
              {HELP_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-amber-900/60 dark:text-amber-300/70 hover:text-amber-700 dark:hover:text-amber-200 transition-colors text-[18px]"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* App badges */}
        <div className="border-t border-amber-200 dark:border-amber-900 mt-12 pt-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-full md:w-auto">
            <h4
              className="font-bold text-[22px] text-amber-950 dark:text-white mb-2"
              style={{ fontFamily: "Merriweather, serif" }}
            >
              {t("readAnywhere")}
            </h4>
            <p className="text-amber-900/60 dark:text-amber-300/60 text-[18px]">
              {t("accessLibrary")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download on the App Store"
              className="hover:opacity-80 transition-opacity"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                alt="Download on the App Store"
                loading="lazy"
                decoding="async"
                className="h-12 w-auto"
              />
            </a>
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Get it on Google Play"
              className="hover:opacity-80 transition-opacity"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                loading="lazy"
                decoding="async"
                className="h-12 w-auto"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-amber-200 dark:border-amber-900">
        <div className="max-w-[1600px] mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Payment logos — plain images, no color/bg overrides */}
          <div className="flex flex-wrap items-center gap-3 max-w-full">
            <span className="text-[18px] text-amber-800 dark:text-amber-400 whitespace-nowrap">
              {t("weAccept")}:
            </span>
            <div className="flex flex-wrap items-center gap-2 overflow-x-auto py-1">
              {PAYMENT_LOGOS.map(({ src, alt }) => (
                <div
                  key={alt}
                  className="bg-white rounded overflow-hidden flex items-center justify-center h-6 w-10 border border-gray-200/50 flex-shrink-0"
                >
                  <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-center md:justify-end gap-5 text-[18px] text-amber-900/40 dark:text-amber-400/60">
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
              >
                {t(l.label)}
              </Link>
            ))}
          </div>

          <p className="text-[16px] text-amber-900/30 dark:text-amber-400/40 text-center md:text-right">
            © 2026 KhmerBookStore. {t("allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}
