import { useMemo, useState, useEffect } from "react";
import {
  X as FaTimes,
  Star as FaStar,
  ShoppingCart as FaShoppingCart,
  Heart as FaHeart,
  Heart as FaRegHeart,
  Check as FaCheck,
  BookOpen as FaBookOpen,
  User as FaUser,
  Calendar as FaCalendar,
  Languages as FaLanguage,
  Hash as FaHashtag,
} from "lucide-react";
import { Book } from "../types";
import { useStore } from "../context/StoreContext";

interface BookDetailProps {
  book: Book;
  onClose: () => void;
}

const fakeReviews = [
  {
    name: "Hak Hai",
    avatar:
      "https://static.vecteezy.com/system/resources/thumbnails/048/216/761/small/modern-male-avatar-with-black-hair-and-hoodie-illustration-free-png.png",
    rating: 5,
    date: "3 days ago",
    title: "Life-changing read!",
    comment:
      "Absolutely incredible book. Changed the way I think about everything. Highly recommended to anyone looking to improve themselves.",
    verified: true,
    helpful: 127,
  },
  {
    name: "Sroun Nita",
    avatar:
      "https://img.freepik.com/free-vector/woman-with-braided-hair-illustration_1308-174675.jpg?semt=ais_hybrid&w=740&q=80",
    rating: 5,
    date: "1 week ago",
    title: "A must-read",
    comment:
      "One of those books you wish you'd read years ago. Clear, practical, and deeply insightful. I bought copies for my entire team.",
    verified: true,
    helpful: 89,
  },
  {
    name: "Horm Mengly",
    avatar:
      "https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png",
    rating: 4,
    date: "2 weeks ago",
    title: "Very well written",
    comment:
      "Great book overall. Some concepts felt familiar but the presentation is unique and refreshing. Would recommend.",
    verified: true,
    helpful: 54,
  },
  {
    name: "Sok Dara",
    avatar:
      "https://static.vecteezy.com/system/resources/thumbnails/048/216/761/small/modern-male-avatar-with-black-hair-and-hoodie-illustration-free-png.png",
    rating: 5,
    date: "1 month ago",
    title: "Couldn't put it down",
    comment:
      "Started reading on Friday evening and finished it by Sunday morning. The writing style is engaging and the content is excellent.",
    verified: false,
    helpful: 43,
  },
];

const formats = ["Paperback", "Hardcover", "E-Book", "Audiobook"] as const;

export function BookDetail({ book, onClose }: BookDetailProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } =
    useStore();
  const [selectedFormat, setSelectedFormat] = useState(book.format);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "description" | "details" | "reviews"
  >("description");
  const [added, setAdded] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const inWishlist = isInWishlist(book.id);

  useEffect(() => {
    document.body.classList.add("book-detail-open");
    return () => document.body.classList.remove("book-detail-open");
  }, []);

  const galleryImages = useMemo(() => {
    const fallbackShots = [
      `https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=900&h=1200&fit=crop&q=80`,
      `https://images.unsplash.com/photo-1512820790803-83ca734da794?w=900&h=1200&fit=crop&q=80`,
      `https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=900&h=1200&fit=crop&q=80`,
    ];
    const base = [book.image, ...(book.images ?? [])].filter(Boolean);
    const unique = Array.from(new Set(base));
    const completed = [...unique];

    for (const shot of fallbackShots) {
      if (completed.length >= 3) break;
      if (!completed.includes(shot)) completed.push(shot);
    }

    return completed.slice(0, Math.max(3, completed.length));
  }, [book.image, book.images]);

  const formatPrices: Record<string, number> = {
    Paperback: book.price,
    Hardcover: book.price + 8,
    "E-Book": book.price - 5,
    Audiobook: book.price + 5,
  };

  const currentPrice = formatPrices[selectedFormat] ?? book.price;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++)
      addToCart({ ...book, price: currentPrice }, selectedFormat);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-md z-[100]"
        onClick={onClose}
      />
      <div className="relative min-h-screen flex items-start justify-center p-4 pt-32 lg:pt-[200px] pb-8 z-[100]">
        <div className="relative bg-white dark:bg-dark-bg rounded-3xl max-w-6xl w-full shadow-2xl overflow-hidden animate-scale-in border dark:border-white/5">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-12 h-12 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:rotate-90 transition-all shadow-sm"
          >
            <FaTimes size={18} />
          </button>

          <div className="grid lg:grid-cols-5 gap-0">
            {/* Left - Book Cover */}
            <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-gray-900 to-black p-6 md:p-8 flex flex-col">
              {/* Badges */}
              <div className="flex gap-2 mb-6">
                {book.isNew && (
                  <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
                    NEW
                  </span>
                )}
                {book.isBestseller && (
                  <span className="px-3 py-1 bg-amber-600 text-white text-xs font-bold rounded-full">
                    🔥 Bestseller
                  </span>
                )}
                {book.isSale && (
                  <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    SALE
                  </span>
                )}
              </div>

              <div className="flex gap-5 flex-1 items-start">
                {/* Thumbnails (Left side) */}
                {galleryImages.length > 1 && (
                  <div className="flex flex-col gap-3 shrink-0">
                    {galleryImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImg(i)}
                        className={`w-16 rounded-xl overflow-hidden border transition-all ${
                          currentImg === i
                            ? "border-amber-400 shadow-lg shadow-amber-500/20 scale-105"
                            : "border-white/10 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-24 object-cover bg-white/10"
                        />
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Main Image (Right side) */}
                <div className="relative flex-1 flex justify-center items-center w-full min-h-[400px]">
                  <div className="absolute -inset-8 bg-gradient-to-b from-amber-500/20 to-transparent blur-3xl" />
                  <img
                    src={galleryImages[currentImg]}
                    alt={`${book.title} - view ${currentImg + 1}`}
                    className="relative w-full max-h-[500px] object-contain rounded-2xl border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.7)]"
                  />
                </div>
              </div>
            </div>

            {/* Right - Details */}
            <div className="lg:col-span-3 p-8 flex flex-col">
              <p className="text-sm text-amber-700 dark:text-amber-400 font-bold uppercase tracking-widest mb-2">
                {book.genre}
              </p>
              <h1
                className="text-3xl font-black text-gray-900 dark:text-white mb-2 leading-tight"
                style={{ fontFamily: "Merriweather, serif" }}
              >
                {book.title}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                by{" "}
                <span className="text-amber-800 dark:text-amber-500 font-semibold">
                  {book.author}
                </span>
              </p>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => {
                    const isFull = i < Math.floor(book.rating);
                    const isHalf =
                      i === Math.floor(book.rating) && book.rating % 1 !== 0;
                    return (
                      <div key={i} className="relative">
                        {/* Background Star */}
                        <FaStar
                          size={18}
                          className="text-gray-200 dark:text-gray-700"
                        />
                        {/* Foreground Star */}
                        <div
                          className="absolute inset-0 overflow-hidden text-amber-400"
                          style={{
                            width: isFull ? "100%" : isHalf ? "50%" : "0%",
                          }}
                        >
                          <FaStar size={18} className="fill-current" />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  {book.rating}
                </span>
                <span className="text-gray-400 dark:text-gray-600">|</span>
                <span className="text-gray-500 dark:text-gray-400">
                  {book.reviews.toLocaleString()} reviews
                </span>
                <span
                  className={`font-semibold text-sm ${book.inStock ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}
                >
                  {book.inStock
                    ? `✓ In Stock (${book.stockCount})`
                    : "✗ Out of Stock"}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-black text-gray-900 dark:text-amber-400">
                  ${currentPrice.toFixed(2)}
                </span>
                {book.originalPrice && selectedFormat === book.format && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ${book.originalPrice.toFixed(2)}
                    </span>
                    <span className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold rounded-full">
                      Save ${(book.originalPrice - currentPrice).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {/* Format Selection */}
              <div className="mb-6">
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                  FORMAT
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {formats.map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setSelectedFormat(fmt)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border-2 ${
                        selectedFormat === fmt
                          ? "bg-amber-900 border-amber-900 text-white shadow-lg shadow-amber-900/30"
                          : "bg-white dark:bg-dark-card text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-amber-400"
                      }`}
                    >
                      {fmt}
                      <br />
                      <span
                        className={`text-xs font-normal ${selectedFormat === fmt ? "text-amber-200" : "text-gray-400"}`}
                      >
                        ${formatPrices[fmt]?.toFixed(2)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                  QUANTITY
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-200 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-dark-card">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-lg font-bold dark:text-white"
                    >
                      −
                    </button>
                    <span className="w-14 text-center font-bold text-lg dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-lg font-bold dark:text-white"
                    >
                      +
                    </button>
                  </div>
                  {book.stockCount <= 10 && book.inStock && (
                    <span className="text-red-500 text-sm font-medium">
                      Only {book.stockCount} left!
                    </span>
                  )}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={!book.inStock}
                  className={`flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                    added
                      ? "bg-emerald-600 text-white"
                      : !book.inStock
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-amber-800 hover:bg-amber-700 text-white shadow-xl shadow-amber-900/20 hover:shadow-amber-700/30"
                  }`}
                >
                  {added ? (
                    <>
                      <FaCheck /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <FaShoppingCart /> Add to Cart
                    </>
                  )}
                </button>
                <button
                  onClick={() =>
                    inWishlist
                      ? removeFromWishlist(book.id)
                      : addToWishlist(book)
                  }
                  className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                    inWishlist
                      ? "bg-red-500 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-red-50 hover:text-red-500"
                  }`}
                >
                  {inWishlist ? (
                    <FaHeart size={22} />
                  ) : (
                    <FaRegHeart size={22} />
                  )}
                </button>
              </div>

              {/* Tabs */}
              <div className="border-t dark:border-white/5">
                <div className="flex border-b dark:border-white/5">
                  {(["description", "details", "reviews"] as const).map(
                    (tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 text-sm font-bold capitalize transition-all ${
                          activeTab === tab
                            ? "text-amber-800 dark:text-amber-400 border-b-2 border-amber-800 dark:border-amber-400 bg-amber-50/50 dark:bg-white/5"
                            : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                        }`}
                      >
                        {tab === "reviews"
                          ? `Reviews (${book.reviews.toLocaleString()})`
                          : tab}
                      </button>
                    ),
                  )}
                </div>

                <div className="py-6 max-h-60 overflow-y-auto pr-1">
                  {activeTab === "description" && (
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {book.description}
                    </p>
                  )}

                  {activeTab === "details" && (
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        {
                          icon: FaBookOpen,
                          label: "Pages",
                          value: book.pages.toLocaleString(),
                        },
                        { icon: FaUser, label: "Author", value: book.author },
                        {
                          icon: FaCalendar,
                          label: "Published",
                          value: book.publishedYear.toString(),
                        },
                        {
                          icon: FaLanguage,
                          label: "Language",
                          value: book.language,
                        },
                        { icon: FaHashtag, label: "ISBN", value: book.isbn },
                        {
                          icon: FaBookOpen,
                          label: "Publisher",
                          value: book.publisher,
                        },
                      ].map(({ icon: Icon, label, value }) => (
                        <div
                          key={label}
                          className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl border dark:border-white/5"
                        >
                          <Icon
                            className="text-amber-700 dark:text-amber-400 flex-shrink-0"
                            size={14}
                          />
                          <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              {label}
                            </p>
                            <p className="text-sm font-semibold text-gray-800 dark:text-white">
                              {value}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "reviews" && (
                    <div className="space-y-4">
                      {/* Summary */}
                      <div className="bg-amber-50 dark:bg-white/5 rounded-2xl p-4 flex items-center gap-6 mb-4 border dark:border-white/5">
                        <div className="text-center">
                          <p className="text-4xl font-black text-gray-900 dark:text-white">
                            {book.rating}
                          </p>
                          <div className="flex justify-center my-1">
                            {[...Array(5)].map((_, i) => {
                              const isFull = i < Math.floor(book.rating);
                              const isHalf =
                                i === Math.floor(book.rating) &&
                                book.rating % 1 !== 0;
                              return (
                                <div key={i} className="relative">
                                  {/* Background Star */}
                                  <FaStar
                                    size={13}
                                    className="text-gray-300 dark:text-gray-700"
                                  />
                                  {/* Foreground Star */}
                                  <div
                                    className="absolute inset-0 overflow-hidden text-amber-400"
                                    style={{
                                      width: isFull
                                        ? "100%"
                                        : isHalf
                                          ? "50%"
                                          : "0%",
                                    }}
                                  >
                                    <FaStar
                                      size={13}
                                      className="fill-current"
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <p className="text-xs text-gray-500">
                            {book.reviews.toLocaleString()} reviews
                          </p>
                        </div>
                        <div className="flex-1 space-y-1">
                          {[5, 4, 3, 2, 1].map((s) => (
                            <div key={s} className="flex items-center gap-2">
                              <span className="text-xs text-gray-500 w-2">
                                {s}
                              </span>
                              <FaStar size={10} className="text-amber-400" />
                              <div className="flex-1 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-amber-400 rounded-full"
                                  style={{
                                    width: `${s === 5 ? 72 : s === 4 ? 18 : s === 3 ? 6 : s === 2 ? 2 : 2}%`,
                                  }}
                                />
                              </div>
                              <span className="text-xs text-gray-400 w-6">
                                {s === 5
                                  ? "72%"
                                  : s === 4
                                    ? "18%"
                                    : s === 3
                                      ? "6%"
                                      : s === 2
                                        ? "2%"
                                        : "2%"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {fakeReviews.map((rev, i) => (
                        <div
                          key={i}
                          className="border-b border-gray-100 dark:border-white/5 pb-4 last:border-0"
                        >
                          <div className="flex items-start gap-3">
                            <img
                              src={rev.avatar}
                              alt={rev.name}
                              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-gray-900 dark:text-white text-sm">
                                    {rev.name}
                                  </p>
                                  {rev.verified && (
                                    <span className="text-xs bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                                      Verified
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-gray-400 dark:text-gray-500">
                                  {rev.date}
                                </span>
                              </div>
                              <div className="flex my-1">
                                {[...Array(5)].map((_, j) => (
                                  <FaStar
                                    key={j}
                                    size={11}
                                    className={
                                      j < rev.rating
                                        ? "text-amber-400"
                                        : "text-gray-200 dark:text-gray-700"
                                    }
                                    fill={
                                      j < rev.rating ? "currentColor" : "none"
                                    }
                                  />
                                ))}
                              </div>
                              <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-1">
                                {rev.title}
                              </p>
                              <p className="text-gray-600 dark:text-gray-400 text-sm">
                                {rev.comment}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                {rev.helpful} people found this helpful
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
