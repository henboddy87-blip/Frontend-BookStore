import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart as FaShoppingCart,
  Heart as FaHeart,
  User as FaUser,
  Search as FaSearch,
  Menu as FaBars,
  X as FaTimes,
  Star as FaStar,
  Sun as FaSun,
  Moon as FaMoon,
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { books } from "../data/books";
import { Book } from "../types";
import { TranslationKey } from "../data/translations";

interface NavbarProps {
  onCartClick: () => void;
  onWishlistClick: () => void;
  onAuthClick: () => void;
  onSearch: (query: string) => void;
  currentCategory?: string;
  onCategoryChange?: (cat: string) => void;
}

const navCategories: { id: string; label: TranslationKey }[] = [
  { id: "all", label: "allBooks" },
  { id: "khmer-literature", label: "khmerLiterature" },
  { id: "fiction", label: "fiction" },
  { id: "non-fiction", label: "nonFiction" },
  { id: "selfHelp", label: "selfHelp" },
  { id: "biography", label: "biography" },
  { id: "children", label: "children" },
  { id: "health", label: "health" },
];

export function Navbar({
  onCartClick,
  onWishlistClick,
  onAuthClick,
  onSearch,
}: NavbarProps) {
  const {
    cartCount,
    wishlist,
    user,
    language,
    setLanguage,
    t,
    isDarkMode,
    toggleDarkMode,
  } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [compactDetail, setCompactDetail] = useState(false);
  const [cartShake, setCartShake] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Shake cart icon when items change
  useEffect(() => {
    if (cartCount > 0) {
      setCartShake(true);
      const timer = setTimeout(() => setCartShake(false), 600);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;

      // Search outside check
      const insideDesktopSearch = searchRef.current?.contains(target);
      const insideMobileSearch = mobileSearchRef.current?.contains(target);
      if (!insideDesktopSearch && !insideMobileSearch) {
        setShowDropdown(false);
      }

      // Language menu outside check
      const insideLangMenu = langMenuRef.current?.contains(target);
      if (!insideLangMenu) {
        setShowLanguageMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Observe BookDetail open/close via body class
  useEffect(() => {
    setCompactDetail(
      typeof document !== "undefined" &&
        document.body.classList.contains("book-detail-open"),
    );
    const obs = new MutationObserver(() => {
      setCompactDetail(document.body.classList.contains("book-detail-open"));
    });
    obs.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  // Search suggestions
  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    return books
      .filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.genre.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setShowDropdown(false);
  };

  const handleSearchInput = (val: string) => {
    setSearchQuery(val);
    setShowDropdown(val.length >= 2);
  };

  const handleResultClick = (book: Book) => {
    setSearchQuery(book.title);
    onSearch(book.title);
    setShowDropdown(false);
  };

  const handleHomeClick = () => {
    navigate("/");
    setMobileOpen(false);
  };

  const catSlug = (catId: string) => {
    const slugMap: Record<string, string> = { selfHelp: "self-help" };
    return slugMap[catId] ?? catId;
  };

  const isCatActive = (catId: string): boolean => {
    if (isHome) return false;
    if (catId === "all") return location.pathname === "/books";
    return location.pathname === `/genre/${catSlug(catId)}`;
  };

  const handleCatClick = (catId: string) => {
    navigate(catId === "all" ? "/books" : `/genre/${catSlug(catId)}`);
    setMobileOpen(false);
  };

  /* ── Search Dropdown Renderer ── */
  const SearchDropdown = () => {
    if (!showDropdown || searchResults.length === 0) return null;
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden z-50 animate-fadeIn">
        <div className="px-4 py-2.5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
            Suggestions
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {searchResults.map((book) => (
            <button
              key={book.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleResultClick(book)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-amber-50 dark:hover:bg-white/5 transition-colors text-left"
            >
              <div className="w-10 h-14 flex-shrink-0 bg-gray-100 dark:bg-white/5 rounded-lg overflow-hidden flex items-center justify-center p-0.5">
                <img
                  src={book.image}
                  alt={book.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-auto object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {book.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  by {book.author}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-amber-700 dark:text-amber-500 font-semibold">
                    ${book.price.toFixed(2)}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <FaStar size={9} className="text-amber-400" />
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {book.rating}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-full flex-shrink-0">
                {book.genre}
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            onSearch(searchQuery);
            setShowDropdown(false);
          }}
          className="w-full px-4 py-3 text-sm font-semibold text-amber-800 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-white/5 transition-colors border-t border-gray-100 dark:border-white/5 flex items-center justify-center gap-2"
        >
          <FaSearch size={12} />
          View all results for &ldquo;{searchQuery}&rdquo;
        </button>
      </div>
    );
  };

  return (
    <>
      {/* Top Promo Bar */}
      <div className="bg-amber-800 text-amber-50 text-center text-[16px] py-2 px-4 flex flex-wrap items-center justify-center gap-1">
        <span>{t("freeShipping")}</span>
        <span className="hidden xs:inline">|</span>
        <span className="w-full xs:w-auto">
          {t("useCode")} <strong className="text-amber-300">BOOKWORM15</strong>{" "}
          {t("offFirstOrder")}
        </span>
      </div>

      {/* Main Nav */}
      <nav
        className={`sticky top-0 z-[110] transition-all duration-300 ${isScrolled ? "bg-white/95 dark:bg-dark-bg/95 backdrop-blur-md shadow-md" : "bg-white dark:bg-dark-bg shadow-sm"}`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex flex-wrap items-center gap-4 ${compactDetail ? "py-1" : "py-3"}`}
          >
            {/* Logo + Desktop Nav links */}
            <div className="order-1 flex min-w-0 items-center gap-4 lg:gap-5">
              {/* Logo absolute path so it resolves correctly on any route */}
              <button
                type="button"
                onClick={handleHomeClick}
                aria-label="Go to homepage"
                className="flex items-center gap-2 flex-shrink-0"
              >
                <div
                  className={`h-20 w-20 sm:h-28 sm:w-28 ${compactDetail ? "h-12 w-12 sm:h-16 sm:w-16" : ""} flex items-center justify-center flex-shrink-0`}
                >
                  <img
                    src="/logo.png"
                    alt="logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex items-center">
                  <span
                    className="text-xl sm:text-2xl md:text-3xl font-black text-amber-900 dark:text-amber-400"
                    style={{ fontFamily: "Merriweather, serif" }}
                  >
                    Khmer
                  </span>
                  <span
                    className="text-xl sm:text-2xl md:text-3xl font-black text-amber-600 dark:text-amber-600"
                    style={{ fontFamily: "Merriweather, serif" }}
                  >
                    Bookstore
                  </span>
                </div>
              </button>

              {/* Book category */}
              <div className="hidden xl:flex items-center gap-1">
                <button
                  onClick={handleHomeClick}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[18px] font-semibold transition-all whitespace-nowrap ${
                    isHome
                      ? "bg-amber-900 text-white dark:bg-amber-800"
                      : "text-gray-600 dark:text-gray-300 hover:text-amber-900 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-white/5"
                  }`}
                >
                  {t("home")}
                </button>

                {navCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCatClick(cat.id)}
                    className={`px-4 py-2 rounded-full text-[18px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      isCatActive(cat.id)
                        ? "bg-amber-900 text-white dark:bg-amber-800"
                        : "text-gray-600 dark:text-gray-300 hover:text-amber-900 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-white/5"
                    }`}
                  >
                    {t(cat.label)}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="order-3 hidden lg:flex flex-1 max-w-4xl xl:max-w-5xl mx-4"
            >
              <div
                ref={searchRef}
                className={`relative w-full transition-all ${searchFocused ? "scale-[1.01]" : ""}`}
              >
                <input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  onFocus={() => {
                    setSearchFocused(true);
                    if (searchQuery.length >= 2) setShowDropdown(true);
                  }}
                  onBlur={() => {
                    setSearchFocused(false);
                    setTimeout(() => setShowDropdown(false), 200);
                  }}
                  className={`w-full px-6 py-3.5 pl-14 rounded-full border-2 transition-all focus:outline-none bg-white dark:bg-dark-card text-[18px] dark:text-white ${
                    searchFocused
                      ? "border-amber-500 shadow-lg dark:border-amber-600"
                      : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
                  }`}
                />
                <FaSearch
                  className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors text-lg ${searchFocused ? "text-amber-600" : "text-gray-400"}`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      onSearch("");
                      setShowDropdown(false);
                    }}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-white dark:bg-dark-card rounded-full p-1"
                  >
                    <FaTimes size={16} />
                  </button>
                )}
                <SearchDropdown />
              </div>
            </form>

            {/* Action Buttons */}
            <div className="order-2 ml-auto flex items-center gap-1.5 sm:gap-2 flex-shrink-0 xl:ml-2">
              {/* Language Switcher Dropdown */}
              <div ref={langMenuRef} className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm border border-gray-200 dark:border-white/10 hover:border-amber-500 dark:hover:border-amber-600 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  aria-label="Change language"
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-white/5 shadow-inner border border-gray-100 dark:border-white/5">
                    <img
                      src={
                        language === "km"
                          ? "https://flagcdn.com/w40/kh.png"
                          : "https://flagcdn.com/w40/us.png"
                      }
                      alt={language}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-300">
                    {language === "km" ? "ភាសាខ្មែរ" : "English"}
                  </span>
                  <div
                    className={`w-2 h-2 border-r-2 border-b-2 border-gray-400 transition-transform ${showLanguageMenu ? "rotate-45 -translate-y-0.5" : "-rotate-135 translate-y-0.5"}`}
                    style={{
                      transform: showLanguageMenu
                        ? "rotate(225deg)"
                        : "rotate(45deg)",
                    }}
                  />
                </button>

                {showLanguageMenu && (
                  <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-gray-100 dark:border-white/5 py-2 z-[60] animate-fadeIn">
                    <div className="px-3 py-1.5 mb-1">
                      <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                        Select Language
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setLanguage("km");
                        setShowLanguageMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-amber-50 dark:hover:bg-white/5 transition-colors text-left ${language === "km" ? "bg-amber-50/50 dark:bg-white/10" : ""}`}
                    >
                      <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 border border-gray-100 dark:border-white/10 shadow-sm">
                        <img
                          src="https://flagcdn.com/w40/kh.png"
                          alt="Khmer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span
                        className={`text-sm font-bold ${language === "km" ? "text-amber-900" : "text-gray-700"}`}
                      >
                        Khmer
                      </span>
                      {language === "km" && (
                        <div className="ml-auto w-1.5 h-1.5 bg-amber-600 rounded-full" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setLanguage("en");
                        setShowLanguageMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-amber-50 dark:hover:bg-white/5 transition-colors text-left ${language === "en" ? "bg-amber-50/50 dark:bg-white/10" : ""}`}
                    >
                      <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 border border-gray-100 dark:border-white/10 shadow-sm">
                        <img
                          src="https://flagcdn.com/w40/us.png"
                          alt="English"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span
                        className={`text-sm font-bold ${language === "en" ? "text-amber-900" : "text-gray-700"}`}
                      >
                        English
                      </span>
                      {language === "en" && (
                        <div className="ml-auto w-1.5 h-1.5 bg-amber-600 rounded-full" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* User Account */}
              <button
                type="button"
                onClick={user ? () => navigate('/profile') : onAuthClick}
                aria-label={user ? "Go to profile" : "Open sign in panel"}
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-amber-900 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-white/5 transition-all cursor-pointer"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ${user ? "bg-amber-800 dark:bg-amber-700 text-white" : "bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400"}`}
                >
                  {user ? (
                    user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    )
                  ) : (
                    <FaUser size={14} />
                  )}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    {user ? t("hello") + "," : t("welcome")}
                  </p>
                  <p className="text-base font-semibold dark:text-white">
                    {user ? user.name?.split(" ")[0] || "User" : t("signIn")}
                  </p>
                </div>
              </button>

              {/* Wishlist */}
              <button
                type="button"
                onClick={onWishlistClick}
                aria-label="Open wishlist"
                className="relative p-2.5 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all cursor-pointer"
              >
                <FaHeart size={18} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                type="button"
                onClick={onCartClick}
                aria-label="Open cart"
                className={`relative p-2.5 text-gray-600 dark:text-gray-300 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-white/5 rounded-full transition-all cursor-pointer btn-press ${cartShake ? 'animate-cart-shake' : ''}`}
              >
                <FaShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-amber-700 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Dark Mode Toggle */}
              <button
                type="button"
                onClick={toggleDarkMode}
                className={`p-2.5 rounded-full transition-all cursor-pointer ${isDarkMode ? "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20" : "bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-amber-900"}`}
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={
                  mobileOpen ? "Close mobile menu" : "Open mobile menu"
                }
                className="lg:hidden p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-all cursor-pointer"
              >
                {mobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileOpen && (
            <div className="lg:hidden py-4 border-t dark:border-white/10 animate-fadeIn">
              <div ref={mobileSearchRef} className="relative mb-4">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t("searchPlaceholder")}
                      value={searchQuery}
                      onChange={(e) => handleSearchInput(e.target.value)}
                      onFocus={() => {
                        if (searchQuery.length >= 2) setShowDropdown(true);
                      }}
                      className="w-full px-5 py-3 pl-12 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:text-white"
                    />
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          onSearch("");
                          setShowDropdown(false);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <FaTimes size={14} />
                      </button>
                    )}
                  </div>
                </form>

                {/* Mobile Search Dropdown */}
                {showDropdown && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-dark-card rounded-xl shadow-xl border border-gray-100 dark:border-white/5 overflow-hidden z-50">
                    <div className="max-h-64 overflow-y-auto">
                      {searchResults.slice(0, 5).map((book) => (
                        <button
                          key={book.id}
                          type="button"
                          onClick={() => {
                            handleResultClick(book);
                            setMobileOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-amber-50 dark:hover:bg-white/5 transition-colors text-left"
                        >
                          <div className="w-8 h-11 flex-shrink-0 bg-gray-100 dark:bg-white/5 rounded-lg overflow-hidden flex items-center justify-center">
                            <img
                              src={book.image}
                              alt={book.title}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-auto object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                              {book.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              by {book.author} · ${book.price.toFixed(2)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onSearch(searchQuery);
                        setShowDropdown(false);
                        setMobileOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-sm font-semibold text-amber-800 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-white/5 border-t border-gray-100 dark:border-white/5 flex items-center justify-center gap-2"
                    >
                      <FaSearch size={11} />
                      See all results
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  onClick={handleHomeClick}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all text-left ${
                    isHome
                      ? "bg-amber-900 text-white dark:bg-amber-800"
                      : "bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-white/10"
                  }`}
                >
                  {t("home")}
                </button>

                {navCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCatClick(cat.id)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-semibold transition-all text-left ${
                      isCatActive(cat.id)
                        ? "bg-amber-900 text-white dark:bg-amber-800"
                        : "bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-white/10"
                    }`}
                  >
                    {t(cat.label)}
                  </button>
                ))}
              </div>

              {/* Mobile language selector removed — use top language toggle instead */}

              <div className="mt-4">
                <button
                  onClick={() => {
                    if (user) {
                      navigate('/profile');
                    } else {
                      onAuthClick();
                    }
                    setMobileOpen(false);
                  }}
                  className="w-full py-3 bg-amber-900 text-white rounded-xl font-semibold hover:bg-amber-800 transition-colors cursor-pointer"
                >
                  {user
                    ? `${t("hello")}, ${user.name?.split(" ")[0] || "User"}!`
                    : t("signIn") + " / " + t("signUp")}
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>


    </>
  );
}
