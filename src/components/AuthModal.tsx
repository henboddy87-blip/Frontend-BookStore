import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X as FaTimes,
  User as FaUser,
  Mail as FaEnvelope,
  Lock as FaLock,
  LogOut as FaSignOutAlt,
  Heart as FaHeart,
  ChevronRight as FaChevronRight,
  PackageOpen as FaBoxOpen,
  Truck as FaTruck,
  CheckCircle2 as FaCheckCircle,
  Clock3 as FaClock,
  Eye as FaEye,
  EyeOff as FaEyeSlash,
} from "lucide-react";
import { useStore } from "../context/StoreContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type Tab = "profile" | "orders" | "wishlist";

/* ── Orders Tab ── */
export function OrdersTab() {
  const { orders, t } = useStore();

  const statusMeta = (status: string) => {
    if (status === "Delivered")
      return {
        color:
          "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400",
        icon: FaCheckCircle,
      };
    if (status === "In Transit")
      return {
        color:
          "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400",
        icon: FaTruck,
      };
    return {
      color:
        "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400",
      icon: FaClock,
    };
  };

  return (
    <div>
      <h3
        className="font-black text-gray-900 dark:text-white text-lg mb-4"
        style={{ fontFamily: "Merriweather, serif" }}
      >
        {t("orders")}
      </h3>

      {orders.length === 0 ? (
        <div className="text-center py-10 text-gray-400 dark:text-gray-500">
          <FaBoxOpen size={36} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm font-semibold">{t("noOrders")}</p>
          <p className="text-xs mt-1">{t("checkoutToSee")}</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-2">
          {orders.map((order) => {
            const { color, icon: Icon } = statusMeta(order.status);
            return (
              <div
                key={order.id}
                className="bg-amber-50 dark:bg-white/5 border border-amber-100 dark:border-white/5 rounded-2xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-900 dark:text-white text-sm">
                    {order.id}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${color}`}
                  >
                    <Icon size={10} /> {order.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-2">{order.date}</p>
                {/* Book covers */}
                {order.itemImages && order.itemImages.length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {order.itemImages.slice(0, 4).map((b, i) => (
                      <div
                        key={i}
                        className="w-10 h-14 bg-white dark:bg-dark-bg rounded-lg shadow-sm overflow-hidden flex items-center justify-center p-0.5 flex-shrink-0"
                      >
                        <img
                          src={b.image}
                          alt={b.title}
                          className="h-full w-auto object-contain"
                        />
                      </div>
                    ))}
                    {order.itemImages.length > 4 && (
                      <div className="w-10 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center text-xs font-bold text-amber-700 dark:text-amber-400 flex-shrink-0">
                        +{order.itemImages.length - 4}
                      </div>
                    )}
                  </div>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-1">
                  {order.items.join(", ")}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-black text-amber-800 dark:text-amber-400">
                    {order.total}
                  </span>
                  <button className="text-xs text-amber-700 dark:text-amber-500 font-semibold hover:underline flex items-center gap-1">
                    {t("viewDetails")} <FaChevronRight size={10} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Wishlist Tab ── */
export function WishlistTab() {
  const { wishlist, removeFromWishlist, t } = useStore();

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400 dark:text-gray-500">
        <FaHeart size={36} className="mx-auto mb-3 opacity-40" />
        <p className="text-sm font-semibold">{t("wishlistEmpty")}</p>
        <p className="text-xs mt-1">{t("saveBooks")}</p>
      </div>
    );
  }

  return (
    <div>
      <h3
        className="font-black text-gray-900 dark:text-white text-lg mb-4"
        style={{ fontFamily: "Merriweather, serif" }}
      >
        {t("wishlist")}{" "}
        <span className="text-amber-600 dark:text-amber-400">
          ({wishlist.length})
        </span>
      </h3>

      {/* Make wishlist scrollable with a fixed max height similar to orders */}
      <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-2">
        {wishlist.map((book) => (
          <div
            key={book.id}
            className="flex gap-3 bg-amber-50 dark:bg-white/5 border border-amber-100 dark:border-white/5 rounded-2xl p-3"
          >
            <img
              src={book.image}
              alt={book.title}
              className="w-12 h-16 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-sm leading-tight line-clamp-2">
                  {book.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                  {book.author}
                </p>
              </div>
              <p className="text-amber-700 dark:text-amber-400 font-black text-sm">
                ${book.price}
              </p>
            </div>
            <div className="flex flex-col justify-end flex-shrink-0 pb-0.5">
              <button
                onClick={() => removeFromWishlist(book.id)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 transition-colors"
                title="Remove"
              >
                <FaTimes size={11} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Library Tab ── */
// Library tab removed per UI simplification

/* ── Profile Tab ── */
export function ProfileTab({
  user,
  onLogout,
}: {
  user: { name: string; email: string };
  onLogout: () => void;
}) {
  const { orders, wishlist, t } = useStore();

  // library removed; only show orders and wishlist counts

  return (
    <div>
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-amber-700 to-amber-900 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
          <span className="text-3xl font-black text-white">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <h2
          className="text-xl font-black text-gray-900 dark:text-white"
          style={{ fontFamily: "Merriweather, serif" }}
        >
          {user.name}
        </h2>
        <p className="text-gray-400 dark:text-gray-500 text-sm">{user.email}</p>
      </div>
      <div className="bg-amber-50 dark:bg-white/5 rounded-2xl p-4 mb-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white dark:bg-dark-bg rounded-xl shadow-sm flex items-center justify-center">
            <FaUser className="text-amber-700 dark:text-amber-400" size={13} />
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {t("name")}
            </p>
            <p className="font-bold text-gray-900 dark:text-white text-sm">
              {user.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white dark:bg-dark-bg rounded-xl shadow-sm flex items-center justify-center">
            <FaEnvelope
              className="text-amber-700 dark:text-amber-400"
              size={13}
            />
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {t("email")}
            </p>
            <p className="font-bold text-gray-900 dark:text-white text-sm">
              {user.email}
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-5 text-center">
        {[
          { label: t("orders"), value: orders.length },
          { label: t("wishlist"), value: wishlist.length },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-amber-50 dark:bg-white/5 rounded-xl py-3"
          >
            <p className="text-xl font-black text-amber-800 dark:text-amber-400">
              {s.value}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {s.label}
            </p>
          </div>
        ))}
      </div>
      <button
        onClick={onLogout}
        className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all cursor-pointer"
      >
        <FaSignOutAlt /> {t("signOut")}
      </button>
    </div>
  );
}

/* ── Main Modal ── */
export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { user, login, t } = useStore();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    agreedTerms: "",
  });

  const isEmailValid = (value: string) => /^\S+@\S+\.\S+$/.test(value);
  const passwordStrength = (value: string) => {
    if (!value) return "";
    if (value.length < 6) return "Weak";
    if (value.length < 10) return "Good";
    return "Strong";
  };

  const validateForm = () => {
    const nextErrors = {
      name: "",
      email: "",
      password: "",
      confirm: "",
      agreedTerms: "",
    };

    if (!form.email || !isEmailValid(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.password || form.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    if (!isLogin) {
      if (!form.name.trim()) {
        nextErrors.name = "Provide your full name.";
      }
      if (form.password !== form.confirm) {
        nextErrors.confirm = "Passwords must match.";
      }
      if (!agreedTerms) {
        nextErrors.agreedTerms = "You must agree to the terms.";
      }
    }

    setErrors(nextErrors);
    return Object.values(nextErrors).every((value) => !value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setTimeout(() => {
      login(form.name || form.email.split("@")[0], form.email);
      setLoading(false);
      onClose();
      navigate('/profile');
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    setLoading(true);
    setTimeout(() => {
      login(`${provider} User`, `user@${provider.toLowerCase()}.com`);
      setLoading(false);
      onClose();
      navigate('/profile');
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        {/* Changed layout wrapper to max-w-2xl to give the form fields and layout premium spacing */}
        <div className="relative bg-white dark:bg-dark-bg rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-fadeIn border dark:border-white/5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20 hover:rotate-90 transition-all cursor-pointer"
          >
            <FaTimes />
          </button>

          {!user && (
            <div>
              {/* Header */}
              <div className="px-8 pt-10 pb-4 text-center">
                {/* Changed layout box size from w-24 h-24 to a larger, crisp configuration (w-36 h-32) to showcase the intricate royal detail and make the Khmer text perfectly clear */}
                <div className="mx-auto mb-3 w-36 h-32 flex items-center justify-center">
                  <img
                    src="/logo.png"
                    alt="KhmerBookStore logo"
                    className="w-full h-full object-contain scale-110 drop-shadow-sm"
                  />
                </div>
                <h2
                  className="text-2xl font-black text-gray-900 dark:text-white"
                  style={{ fontFamily: "Merriweather, serif" }}
                >
                  {isLogin ? t("signInTo") : t("createAccount")}
                </h2>
                <p className="text-sm mt-1.5 text-gray-500 dark:text-gray-400">
                  {isLogin ? t("authHintSignIn") : t("authHintSignUp")}
                </p>
              </div>

              {/* Form Content Wrapper */}
              <div className="px-10 pb-10 pt-4">
                {/* Social Login Buttons */}
                <div className="space-y-3 mb-6">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin("Google")}
                    disabled={loading}
                    className="w-full py-3.5 border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-dark-card rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 hover:border-gray-300 transition-all text-sm dark:text-white cursor-pointer disabled:opacity-50"
                  >
                    <img
                      src="https://www.svgrepo.com/show/303108/google-icon-logo.svg"
                      alt="Google logo"
                      className="w-5 h-5 object-contain"
                    />
                    {t("continueWithGoogle")}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialLogin("Apple")}
                    disabled={loading}
                    className="w-full py-3.5 bg-black text-white rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-gray-900 transition-all text-sm cursor-pointer disabled:opacity-50"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1920px-Apple_logo_black.svg.png"
                      alt="Apple logo"
                      className="w-5 h-5 object-contain invert dark:invert-0"
                    />
                    {t("continueWithApple")}
                  </button>
                </div>

                {/* Divider */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-gray-100 dark:border-white/5" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-white dark:bg-dark-bg text-gray-400 dark:text-gray-500 text-xs font-medium uppercase tracking-wider">
                      {t("orWithEmail")}
                    </span>
                  </div>
                </div>

                {/* Email/Password Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div>
                      <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                        {t("fullName")}
                      </label>
                      <div className="relative">
                        <FaUser
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          size={13}
                        />
                        <input
                          type="text"
                          placeholder="Your Full Name"
                          value={form.name}
                          required
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                          className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-dark-card rounded-xl focus:outline-none focus:border-amber-500 transition-colors text-sm dark:text-white"
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                          {errors.name}
                        </p>
                      )}
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                      {t("emailAddress")}
                    </label>
                    <div className="relative">
                      <FaEnvelope
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={13}
                      />
                      <input
                        type="email"
                        placeholder="Your Email"
                        value={form.email}
                        required
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-dark-card rounded-xl focus:outline-none focus:border-amber-500 transition-colors text-sm dark:text-white"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        {t("password")}
                      </label>
                      {isLogin && (
                        <button
                          type="button"
                          className="text-xs text-amber-700 dark:text-amber-500 hover:underline font-semibold"
                        >
                          {t("forgotPassword")}
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <FaLock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={13}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder={
                          isLogin ? "Enter your password" : "Min. 6 characters"
                        }
                        value={form.password}
                        required
                        onChange={(e) =>
                          setForm({ ...form, password: e.target.value })
                        }
                        className="w-full pl-11 pr-12 py-3.5 border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-dark-card rounded-xl focus:outline-none focus:border-amber-500 transition-colors text-sm dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <FaEyeSlash size={15} />
                        ) : (
                          <FaEye size={15} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                        {errors.password}
                      </p>
                    )}
                    {!isLogin && form.password && (
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Password strength:{" "}
                        <span className="font-semibold">
                          {passwordStrength(form.password)}
                        </span>
                      </p>
                    )}
                  </div>
                  {isLogin && (
                    <div className="flex items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 accent-amber-700"
                        />
                        Remember me
                      </label>
                    </div>
                  )}
                  {!isLogin && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                          {t("confirmPassword")}
                        </label>
                        <div className="relative">
                          <FaLock
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            size={13}
                          />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Re-enter your password"
                            value={form.confirm}
                            required
                            onChange={(e) =>
                              setForm({ ...form, confirm: e.target.value })
                            }
                            className="w-full pl-11 pr-12 py-3.5 border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-dark-card rounded-xl focus:outline-none focus:border-amber-500 transition-colors text-sm dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showConfirmPassword ? (
                              <FaEyeSlash size={15} />
                            ) : (
                              <FaEye size={15} />
                            )}
                          </button>
                        </div>
                        {errors.confirm && (
                          <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                            {errors.confirm}
                          </p>
                        )}
                      </div>
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={agreedTerms}
                          onChange={(e) => setAgreedTerms(e.target.checked)}
                          className="w-4 h-4 accent-amber-700 mt-0.5 flex-shrink-0"
                        />
                        <span className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                          {t("agreeTo")}{" "}
                          <span className="text-amber-700 dark:text-amber-500 font-semibold hover:underline">
                            {t("terms")}
                          </span>{" "}
                          {t("and")}{" "}
                          <span className="text-amber-700 dark:text-amber-500 font-semibold hover:underline">
                            {t("privacy")}
                          </span>
                        </span>
                      </label>
                      {errors.agreedTerms && (
                        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                          {errors.agreedTerms}
                        </p>
                      )}
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={loading || (!isLogin && !agreedTerms)}
                    className="w-full py-4 bg-amber-800 hover:bg-amber-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                        Please wait...
                      </>
                    ) : isLogin ? (
                      t("signIn")
                    ) : (
                      t("createAccount")
                    )}
                  </button>
                </form>

                {/* Toggle Login/Register */}
                <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-6">
                  {isLogin
                    ? t("dontHaveAccount") + " "
                    : t("alreadyMember") + " "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setForm({
                        name: "",
                        email: "",
                        password: "",
                        confirm: "",
                      });
                      setShowPassword(false);
                      setShowConfirmPassword(false);
                      setAgreedTerms(false);
                    }}
                    className="text-amber-700 dark:text-amber-500 font-bold hover:underline"
                  >
                    {isLogin ? t("signUp") : t("signIn")}
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
