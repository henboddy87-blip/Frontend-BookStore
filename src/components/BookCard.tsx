import { useState, useEffect } from "react";
import {
  Heart as FaHeart,
  Heart as FaRegHeart,
  Star as FaStar,
  ShoppingCart as FaShoppingCart,
  Eye as FaEye,
  Flame as FaFire,
} from "lucide-react";
import { Book } from "../types";
import { useStore } from "../context/StoreContext";

interface BookCardProps {
  book: Book;
  onBookClick: (book: Book) => void;
}

export function BookCard({ book, onBookClick }: BookCardProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } =
    useStore();
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const inWishlist = isInWishlist(book.id);
  const [liked, setLiked] = useState<boolean>(inWishlist);

  // Keep local liked state in sync with store
  useEffect(() => {
    setLiked(inWishlist);
  }, [inWishlist]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(book, book.format);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(book.id);
      setLiked(false);
    } else {
      addToWishlist(book);
      setLiked(true);
    }
    // quick visual pulse
    setTimeout(() => {
      setLiked((v) => v);
    }, 250);
  };

  const discount = book.originalPrice
    ? Math.round((1 - book.price / book.originalPrice) * 100)
    : 0;

  return (
    <div className="card-3d">
      <div
        onClick={() => onBookClick(book)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="card-3d-inner group bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 flex flex-col cursor-pointer shadow-sm"
      >
      {/* Cover */}
      <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 aspect-[3/4] overflow-hidden flex items-center justify-center p-4">
        {!imgLoaded && <div className="absolute inset-0 shimmer" />}
        <img
          src={book.image}
          alt={book.title}
          onLoad={() => setImgLoaded(true)}
          loading="lazy"
          decoding="async"
          className={`h-full w-auto max-w-full object-contain drop-shadow-xl cover-glow transition-all duration-500 ${hovered ? 'scale-105' : 'scale-100'} ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {book.isNew && (
            <span className="badge-bounce px-2.5 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-sm">
              NEW
            </span>
          )}
          {book.isBestseller && (
            <span className="badge-bounce px-2.5 py-1 bg-amber-600 text-white text-xs font-bold rounded-full shadow-sm flex items-center gap-1">
              <FaFire size={9} /> Best
            </span>
          )}
          {book.isSale && discount > 0 && (
            <span className="badge-bounce px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-sm">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all z-10 shadow-md ${
            liked
              ? "bg-red-500 text-white scale-105"
              : "bg-white/90 dark:bg-dark-card/90 text-gray-400 dark:text-gray-500 hover:text-red-500 hover:scale-110"
          }`}
          aria-pressed={liked}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        >
          {liked ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
        </button>

        {/* Format badge */}
        <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 text-white text-xs rounded-lg backdrop-blur-sm">
          {book.format}
        </div>

        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3 p-4 transition-all duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}
        >
          <button
            type="button"
            onClick={handleAddToCart}
            className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
              added
                ? "bg-emerald-500 text-white"
                : "bg-white dark:bg-amber-600 text-gray-900 dark:text-white hover:bg-amber-50 dark:hover:bg-amber-500"
            }`}
            aria-label={added ? "Added to cart" : "Add to cart"}
          >
            <FaShoppingCart size={13} />
            {added ? "Added ✓" : "Add to Cart"}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBookClick(book);
            }}
            className="w-full py-2.5 rounded-xl border-2 border-white text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
            aria-label="Open quick view"
          >
            <FaEye size={13} /> Quick View
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-amber-700 dark:text-amber-500 font-semibold uppercase tracking-wide mb-1">
          {book.genre}
        </p>
        <h3
          className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors line-clamp-2 text-sm leading-snug mb-1"
          style={{ fontFamily: "Merriweather, serif" }}
        >
          {book.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 truncate">
          by {book.author}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => {
              const isFull = i < Math.floor(book.rating);
              const isHalf =
                i === Math.floor(book.rating) && book.rating % 1 !== 0;
              return (
                <div key={i} className="relative">
                  {/* Background Star (Muted) */}
                  <FaStar
                    size={11}
                    className="text-gray-200 dark:text-gray-700"
                  />
                  {/* Foreground Star (Filled) */}
                  <div
                    className="absolute inset-0 overflow-hidden text-amber-400"
                    style={{ width: isFull ? "100%" : isHalf ? "50%" : "0%" }}
                  >
                    <FaStar size={11} className="fill-current" />
                  </div>
                </div>
              );
            })}
          </div>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            {book.rating}
          </span>
          <span className="text-xs text-gray-400">
            ({book.reviews.toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-gray-900 dark:text-amber-400">
              ${book.price.toFixed(2)}
            </span>
            {book.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${book.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          {book.inStock ? (
            <span className="text-xs text-emerald-600 font-medium">
              In Stock
            </span>
          ) : (
            <span className="text-xs text-red-500 font-medium">
              Out of Stock
            </span>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
