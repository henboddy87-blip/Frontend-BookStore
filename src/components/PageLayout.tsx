import { useState } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Cart } from './Cart';
import { Wishlist } from './Wishlist';
import { Checkout } from './Checkout';
import { AuthModal } from './AuthModal';
import { BookDetail } from './BookDetail';
import { Book } from '../types';

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleSearch = (q: string) => {
    if (q) window.location.href = `/books?search=${encodeURIComponent(q)}`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg flex flex-col">
      <Navbar
        onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => setIsWishlistOpen(true)}
        onAuthClick={() => setIsAuthOpen(true)}
        onSearch={handleSearch}
      />

      <main className="flex-1 animate-fade-in">
        {children}
      </main>

      <Footer />

      {selectedBook && (
        <BookDetail book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={handleCheckout} />
      <Wishlist isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} onBookClick={setSelectedBook} />
      <Checkout isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}