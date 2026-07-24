import { useState, useMemo } from "react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { PromoBanners } from "../components/PromoBanners";
import { CategoriesSection } from "../components/CategoriesSection";
import { FeaturedBooks } from "../components/FeaturedBooks";
import { BookGrid } from "../components/BookGrid";
import { BookDetail } from "../components/BookDetail";
import { Cart } from "../components/Cart";
import { Wishlist } from "../components/Wishlist";
import { Checkout } from "../components/Checkout";
import { AuthModal } from "../components/AuthModal";
import { Footer } from "../components/Footer";
import { books } from "../data/books";
import { Book } from "../types";
import { useStore } from "../context/StoreContext";

export function HomePage() {
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  const { t } = useStore();

  const filteredBooks = useMemo(() => {
    let res = [...books];
    if (category !== "all") res = res.filter((b) => b.category === category);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      res = res.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.genre.toLowerCase().includes(q) ||
          b.tags.some((t) => t.includes(q)),
      );
    }
    return res;
  }, [category, searchQuery]);

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setSearchQuery("");
    if (cat !== "all") {
      setShowGrid(true);
      setTimeout(
        () =>
          document
            .getElementById("books-grid")
            ?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    } else {
      setShowGrid(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (q) {
      setShowGrid(true);
      setTimeout(
        () =>
          document
            .getElementById("books-grid")
            ?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    }
  };

  const handleShopNow = () => {
    setShowGrid(true);
    setCategory("all");
    setTimeout(
      () =>
        document
          .getElementById("books-grid")
          ?.scrollIntoView({ behavior: "smooth" }),
        100,
    );
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleBackHome = () => {
    setShowGrid(false);
    setCategory("all");
    setSearchQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      <Navbar
        onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => setIsWishlistOpen(true)}
        onAuthClick={() => setIsAuthOpen(true)}
        onSearch={handleSearch}
        currentCategory={category}
        onCategoryChange={handleCategoryChange}
      />
      <main>
        {!showGrid ? (
          <>
            <Hero
              onShopNow={handleShopNow}
              onCategoryChange={handleCategoryChange}
            />
            <PromoBanners />
            <CategoriesSection onCategoryChange={handleCategoryChange} />
            <FeaturedBooks
              books={books}
              onBookClick={setSelectedBook}
              onViewAll={handleShopNow}
            />
          </>
        ) : (
          <>
            <div id="books-grid">
              <BookGrid
                books={filteredBooks}
                onBookClick={setSelectedBook}
              />
            </div>
            <div className="text-center py-10 border-t dark:border-white/10 bg-white dark:bg-dark-bg">
              <button
                onClick={handleBackHome}
                className="inline-flex items-center gap-3 px-8 py-4 bg-amber-900 text-white rounded-full font-bold hover:bg-amber-800 transition-all shadow-xl cursor-pointer"
              >
                 {t('backToHome')}
              </button>
            </div>
          </>
        )}
      </main>
      <Footer />
      {selectedBook && (
        <BookDetail book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />
      <Wishlist
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        onBookClick={setSelectedBook}
      />
      <Checkout
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
