import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Book, CartItem, WishlistItem, User } from "../types";
import { translations, TranslationKey } from "../data/translations";

export interface Order {
  id: string;
  date: string;
  status: "Processing" | "In Transit" | "Delivered";
  statusColor: string;
  items: string[];
  itemImages: { title: string; image: string }[];
  total: string;
}

interface StoreContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  orders: Order[];
  user: User | null;
  addToCart: (book: Book, format: string) => void;
  removeFromCart: (bookId: number, format: string) => void;
  updateQuantity: (bookId: number, format: string, quantity: number) => void;
  clearCart: () => void;
  addOrder: (order: Order) => void;
  addToWishlist: (book: Book) => void;
  removeFromWishlist: (bookId: number) => void;
  isInWishlist: (bookId: number) => boolean;
  login: (name: string, email: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  language: "en" | "km";
  setLanguage: (lang: "en" | "km") => void;
  t: (key: TranslationKey) => string;
  cartTotal: number;
  cartCount: number;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const s = localStorage.getItem("bh_cart");
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    try {
      const s = localStorage.getItem("bh_wishlist");
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const s = localStorage.getItem("bh_orders");
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const s = localStorage.getItem("bh_user");
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  const [language, setLanguage] = useState<"en" | "km">(() => {
    return (localStorage.getItem("bh_lang") as "en" | "km") || "en";
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("bh_theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("bh_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("bh_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("bh_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (user) localStorage.setItem("bh_user", JSON.stringify(user));
    else localStorage.removeItem("bh_user");
  }, [user]);

  useEffect(() => {
    localStorage.setItem("bh_lang", language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("bh_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("bh_theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const addToCart = (book: Book, format: string) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.id === book.id && i.selectedFormat === format,
      );
      if (existing) {
        return prev.map((i) =>
          i.id === book.id && i.selectedFormat === format
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }
      return [...prev, { ...book, quantity: 1, selectedFormat: format }];
    });
  };

  const removeFromCart = (bookId: number, format: string) => {
    setCart((prev) =>
      prev.filter((i) => !(i.id === bookId && i.selectedFormat === format)),
    );
  };

  const updateQuantity = (bookId: number, format: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId, format);
      return;
    }
    setCart((prev) =>
      prev.map((i) =>
        i.id === bookId && i.selectedFormat === format ? { ...i, quantity } : i,
      ),
    );
  };

  const clearCart = () => setCart([]);

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const addToWishlist = (book: Book) => {
    setWishlist((prev) => {
      if (prev.find((i) => i.id === book.id)) return prev;
      return [...prev, book];
    });
  };

  const removeFromWishlist = (bookId: number) => {
    setWishlist((prev) => prev.filter((i) => i.id !== bookId));
  };

  const isInWishlist = (bookId: number) =>
    wishlist.some((i) => i.id === bookId);

  const login = (name: string, email: string) => {
    setUser({
      name,
      email,
      isLoggedIn: true,
      joinDate: new Date().getFullYear().toString(),
      ordersCount: 0,
    });
  };

  const logout = () => setUser(null);

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        orders,
        user,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addOrder,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        login,
        logout,
        updateUser,
        language,
        setLanguage,
        t,
        cartTotal,
        cartCount,
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}