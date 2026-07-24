import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  X as FaTimes,
  Check as FaCheck,
  Truck as FaTruck,
  Box as FaBox,
  CreditCard as FaCreditCard,
  ArrowLeft as FaArrowLeft,
  ArrowRight as FaArrowRight,
  MapPin as FaMapMarkerAlt,
  User as FaUser,
  Mail as FaEnvelope,
  Phone as FaPhone,
  Tag as FaTag,
  Star as FaStar,
  Gift as FaGift,
  Info as FaInfoCircle,
  House as FaHome,
  Building2 as FaBuilding,
  LoaderCircle as FaSpinner,
  Calendar as FaCalendarAlt,
  Sparkles,
  Store,
  BookOpen,
  Printer as FaPrinter,
} from "lucide-react";
import { useStore } from "../context/StoreContext";

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step =
  | "cart"
  | "address"
  | "shipping"
  | "payment"
  | "review"
  | "confirmation";

const STEPS: Step[] = [
  "cart",
  "address",
  "shipping",
  "payment",
  "review",
  "confirmation",
];
const STEP_LABELS = [
  "Cart",
  "Address",
  "Shipping",
  "Payment",
  "Review",
  "Confirm",
];

const PROMO_CODES: Record<string, number> = {
  BOOKWORM15: 0.15,
  READER20: 0.2,
  SAVE10: 0.1,
  NEWUSER25: 0.25,
};

const SHIPPING_METHODS = [
  {
    id: "cod",
    icon: FaTruck,
    name: "Cash on delivery",
    subtitle: "Pay when you receive the books",
    time: "1-2 days",
    price: () => 1.99,
    badge: null,
  },
  {
    id: "branch",
    icon: Store,
    name: "Logistic Branch collection",
    subtitle: "Pick up at logistic branch",
    time: "1-2 days",
    price: () => 1.99,

  },
  {
    id: "home",
    icon: FaHome,
    name: "Home delivery",
    subtitle: "Delivered to your door",
    time: "1-2 days",
    price: () => 1.99,
    badge: "Popular",
  },
  {
    id: "pickup",
    icon: FaBox,
    name: "Pick up at store",
    subtitle: "Pick up at your nearest store",
    time: "Ready in 2 hours",
    price: () => 0,
    badge: null,
  },
];

// Each payment method uses a real logo image URL; card uses inline SI icons
const PAYMENT_METHODS = [
  {
    id: "khqr",
    label: "KHQR",
    logo: "/payment/khqr.png",
  },
  {
    id: "aba",
    label: "ABA",
    logo: "/payment/aba.png",
  },
  {
    id: "aceleda",
    label: "Aceleda",
    logo: "/payment/aceleda.png",
  },
  {
    id: "wing",
    label: "Wing",
    logo: "/payment/wing.png",
  },
];



// ── Main component ─────────────────────────────────────────────────────────────
export function Checkout({ isOpen, onClose }: CheckoutProps) {
  const {
    cart,
    cartTotal,
    clearCart,
    updateQuantity,
    removeFromCart,
    addOrder,
    t,
  } = useStore();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("cart");
  const [processing, setProcessing] = useState(false);
  const [orderDone, setOrderDone] = useState(false);

  const [promoCode, setPromoCode] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
    saveAddress: true,
    addressType: "home" as "home" | "work",
  });
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>(
    {},
  );

  const [shipMethod, setShipMethod] = useState("standard");
  const [payMethod, setPayMethod] = useState("card");

  const [giftWrap, setGiftWrap] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  useEffect(() => {
    if (showQR && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [showQR, timeLeft]);

  // Reset QR state when payment method changes
  useEffect(() => {
    setShowQR(false);
    setTimeLeft(600);
  }, [payMethod]);

  // Robust unique order number generation
  const [orderNumber] = useState(() => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `KBS-${timestamp}-${random}`;
  });

  const selectedShipping = SHIPPING_METHODS.find((m) => m.id === shipMethod)!;
  const shippingCost = selectedShipping ? selectedShipping.price() : 0;
  const discountAmount = cartTotal * promoDiscount;
  const giftCost = giftWrap ? 4.99 : 0;
  const total = cartTotal - discountAmount + shippingCost + giftCost;

  const deliveryDate = new Date();
  const daysToAdd =
    shipMethod === "overnight"
      ? 1
      : shipMethod === "express"
        ? 3
        : shipMethod === "pickup"
          ? 0
          : 7;
  deliveryDate.setDate(deliveryDate.getDate() + daysToAdd);

  const applyPromo = () => {
    const code = promoInput.toUpperCase().trim();
    const rate = PROMO_CODES[code];
    if (rate) {
      setPromoCode(code);
      setPromoDiscount(rate);
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("Invalid code. Try: BOOKWORM15, READER20, SAVE10");
      setPromoApplied(false);
    }
  };
  const removePromo = () => {
    setPromoCode("");
    setPromoInput("");
    setPromoDiscount(0);
    setPromoApplied(false);
    setPromoError("");
  };

  const validateAddress = () => {
    const errs: Record<string, string> = {};
    if (!address.firstName.trim()) errs.firstName = "Required";
    if (!address.lastName.trim()) errs.lastName = "Required";
    if (
      !address.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)
    )
      errs.email = "Valid email required";
    if (!address.phone.trim()) errs.phone = "Required";
    if (!address.line1.trim()) errs.line1 = "Street address required";
    if (!address.city.trim()) errs.city = "Required";
    if (!address.state.trim()) errs.state = "Required";
    if (!address.zip.trim()) errs.zip = "Required";
    setAddressErrors(errs);
    return Object.keys(errs).length === 0;
  };



  const nextStep = () => {
    const idx = STEPS.indexOf(step);
    if (step === "address" && !validateAddress()) return;
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  };
  const prevStep = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  };

  const placeOrder = () => {
    setProcessing(true);
    const snapshot = [...cart];
    setTimeout(() => {
      addOrder({
        id: orderNumber,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        status: "Processing",
        statusColor: "bg-amber-100 text-amber-700",
        items: snapshot.map((i) => i.title),
        itemImages: snapshot.map((i) => ({ title: i.title, image: i.image })),
        total: `$${total.toFixed(2)}`,
      });
      clearCart();
      setProcessing(false);
      setOrderDone(true);
      setStep("confirmation");
    }, 2500);
  };

  // ── Confirmation button handlers ──
  const handleContinueShopping = () => {
    setOrderDone(false);
    setStep("cart");
    onClose();
    navigate("/");
  };

  const handleTrackOrder = () => {
    setOrderDone(false);
    setStep("cart");
    onClose();
    navigate("/track-order");
  };



  if (!isOpen) return null;

  // ── Order summary sidebar ─────────────────────────────────────────────────
  const OrderSummary = ({ compact = false }: { compact?: boolean }) => (
    <div
      className={`${compact ? "" : "lg:col-span-2 bg-amber-50 dark:bg-white/5 border-l border-amber-100 dark:border-white/5"} p-6`}
    >
      <h3
        className="font-black text-gray-900 dark:text-white text-lg mb-4"
        style={{ fontFamily: "Merriweather, serif" }}
      >
        {t("orderSummary")}
      </h3>
      <div className="space-y-3 mb-5 max-h-52 overflow-y-auto pr-1 scrollbar-hide">
        {cart.map((item, i) => (
          <div
            key={i}
            className="flex gap-3 bg-white dark:bg-dark-card rounded-xl p-3 shadow-sm border dark:border-white/5"
          >
            <div className="w-12 h-16 flex-shrink-0 flex items-center justify-center bg-gray-50 dark:bg-dark-bg rounded-lg p-1">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-auto object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-amber-700 uppercase tracking-wide">
                {item.selectedFormat}
              </p>
              <p
                className="text-xs font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug"
                style={{ fontFamily: "Merriweather, serif" }}
              >
                {item.title}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                by {item.author}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {t("quantity")}: {item.quantity}
              </p>
            </div>
            <p className="font-black text-gray-900 dark:text-white text-sm flex-shrink-0">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {step === "cart" && (
        <div className="mb-4">
          {promoApplied ? (
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2">
                <FaTag className="text-emerald-600" size={13} />
                <span className="text-sm font-bold text-emerald-700">
                  {promoCode}
                </span>
                <span className="text-xs text-emerald-600">
                  (-{(promoDiscount * 100).toFixed(0)}%)
                </span>
              </div>
              <button
                onClick={removePromo}
                className="text-red-400 hover:text-red-600 text-xs font-semibold"
              >
                Remove
              </button>
            </div>
          ) : (
            <div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FaTag
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={12}
                  />
                  <input
                    type="text"
                    placeholder="Promo code"
                    value={promoInput}
                    onChange={(e) => {
                      setPromoInput(e.target.value.toUpperCase());
                      setPromoError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                    className="w-full pl-9 pr-3 py-2.5 border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-dark-card rounded-xl text-sm focus:outline-none focus:border-amber-500 dark:text-white transition-colors"
                  />
                </div>
                <button
                  onClick={applyPromo}
                  disabled={!promoInput}
                  className="px-4 py-2.5 bg-gray-900 dark:bg-amber-800 text-white rounded-xl text-sm font-bold hover:bg-gray-800 dark:hover:bg-amber-700 disabled:opacity-40 transition-all cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {promoError && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <FaInfoCircle size={10} /> {promoError}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1.5">
                Try: BOOKWORM15 or READER20
              </p>
            </div>
          )}
        </div>
      )}

      <div className="space-y-2 border-t border-amber-200 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            {t("subtotal")} ({cart.reduce((s, i) => s + i.quantity, 0)}{" "}
            {t("items")})
          </span>
          <span className="font-semibold dark:text-white">
            ${cartTotal.toFixed(2)}
          </span>
        </div>
        {promoApplied && (
          <div className="flex justify-between text-sm">
            <span className="text-emerald-600 flex items-center gap-1">
              <FaTag size={11} /> {t("promo")} ({promoCode})
            </span>
            <span className="text-emerald-600 font-bold">
              -${discountAmount.toFixed(2)}
            </span>
          </div>
        )}
        {step !== "cart" && step !== "address" && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              {t("shipping")} ({selectedShipping?.name})
            </span>
            <span
              className={`font-semibold ${shippingCost === 0 ? "text-emerald-600" : "dark:text-white"}`}
            >
              {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
            </span>
          </div>
        )}
        {giftWrap && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <FaGift size={11} /> {t("giftWrap")}
            </span>
            <span className="font-semibold dark:text-white">$4.99</span>
          </div>
        )}

        <div className="flex justify-between text-lg font-black pt-3 border-t border-amber-200">
          <span className="dark:text-white">{t("total")}</span>
          <span className="text-amber-900 dark:text-amber-400">
            $
            {step === "cart" || step === "address"
              ? (cartTotal - discountAmount + giftCost).toFixed(2)
              : step === "shipping"
                ? (
                  cartTotal -
                  discountAmount +
                  shippingCost +
                  giftCost
                ).toFixed(2)
                : total.toFixed(2)}
          </span>
        </div>
      </div>

      {(step === "cart" || step === "address") && (
        <div className="mt-4 p-3 bg-white dark:bg-dark-card rounded-xl border border-amber-200 dark:border-white/10">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={giftWrap}
              onChange={(e) => setGiftWrap(e.target.checked)}
              className="w-4 h-4 accent-amber-700"
            />
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FaGift className="text-amber-600" /> Gift Wrap (+$4.99)
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Premium wrapping with a personalized note
              </p>
            </div>
          </label>
          {giftWrap && (
            <textarea
              placeholder="Add a gift message (optional)"
              value={giftNote}
              onChange={(e) => setGiftNote(e.target.value)}
              rows={2}
              className="mt-3 w-full px-3 py-2 border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-dark-bg rounded-xl text-sm focus:outline-none focus:border-amber-500 dark:text-white resize-none"
            />
          )}
        </div>
      )}

    </div>
  );

  // ── Payment method selector with real logos ───────────────────────────────
  const PaymentSelector = () => (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {PAYMENT_METHODS.map((pm) => {
        const isSelected = payMethod === pm.id;
        return (
          <label
            key={pm.id}
            className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${isSelected ? "border-amber-700 bg-amber-50 dark:bg-amber-900/20" : "border-gray-200 dark:border-white/10 hover:border-gray-300"}`}
          >
            <input
              type="radio"
              name="paymethod"
              value={pm.id}
              checked={isSelected}
              onChange={() => setPayMethod(pm.id)}
              className="w-4 h-4 accent-amber-700 flex-shrink-0"
            />
            <img
              src={pm.logo}
              alt={pm.label}
              className="h-6 w-auto object-contain max-w-[56px]"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <span className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
              {pm.label}
            </span>
          </label>
        );
      })}
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        onClick={
          orderDone
            ? undefined
            : () => {
              if (!processing) onClose();
            }
        }
      />
      <div className="relative min-h-screen flex items-start justify-center p-3 py-6 md:p-6">
        <div className="relative bg-white dark:bg-dark-bg rounded-3xl max-w-6xl w-full shadow-2xl overflow-hidden my-4 border dark:border-white/5">
          {!orderDone && (
            <button
              onClick={() => {
                if (!processing) onClose();
              }}
              className="absolute top-4 right-4 z-20 w-12 h-12 bg-gray-100 hover:bg-red-50 hover:text-red-500 rounded-full flex items-center justify-center text-gray-500 hover:rotate-90 transition-all"
            >
              <FaTimes size={18} />
            </button>
          )}

          {/* Header + progress */}
          {!orderDone && (
            <div className="bg-gradient-to-r from-amber-900 to-amber-700 px-6 pt-6 pb-4">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-20 h-16 rounded-2xl flex items-center justify-center">
                  <img
                    src="./logo.png"
                    alt="logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1
                    className="text-white font-black text-3xl"
                    style={{ fontFamily: "Merriweather, serif" }}
                  >
                    {t("khmerBookstoreCheckout")}
                  </h1>
                  <p className="text-amber-200 text-sm">
                    {t("secureEncryptedCheckout")}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                {STEPS.filter((s) => s !== "confirmation").map((s, i) => {
                  const currentIdx = STEPS.indexOf(step);
                  const isActive = s === step;
                  const isDone = i < currentIdx;
                  return (
                    <div key={s} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${isDone ? "bg-emerald-400 text-white shadow-lg" : isActive ? "bg-white text-amber-900 shadow-lg scale-110" : "bg-white/20 text-white/60"}`}
                        >
                          {isDone ? <FaCheck size={12} /> : i + 1}
                        </div>
                        <span
                          className={`text-xs mt-1 font-semibold transition-all ${isActive ? "text-white" : isDone ? "text-emerald-300" : "text-white/40"}`}
                        >
                          {STEP_LABELS[i]}
                        </span>
                      </div>
                      {i <
                        STEPS.filter((s) => s !== "confirmation").length -
                        1 && (
                          <div
                            className={`flex-1 h-0.5 mx-1 mb-4 rounded transition-all ${i < currentIdx ? "bg-emerald-400" : "bg-white/20"}`}
                          />
                        )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── CART ── */}
          {step === "cart" && (
            <div className="grid lg:grid-cols-5">
              <div className="lg:col-span-3 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className="text-2xl font-black text-gray-900 dark:text-white"
                    style={{ fontFamily: "Merriweather, serif" }}
                  >
                    {t("yourCart")}{" "}
                    <span className="text-amber-700">
                      ({cart.reduce((s, i) => s + i.quantity, 0)})
                    </span>
                  </h2>
                  {cartTotal < 35 && (
                    <div className="text-right">
                      <p className="text-xs text-amber-700 font-semibold">
                        {t("addForFreeShipping").replace(
                          "{{amount}}",
                          (35 - cartTotal).toFixed(2),
                        )}
                      </p>
                      <div className="w-32 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-amber-600 rounded-full transition-all"
                          style={{
                            width: `${Math.min((cartTotal / 35) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                {cart.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4 text-amber-600">
                      <BookOpen size={60} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {t("cartEmpty")}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      {t("addBooksGetStarted")}
                    </p>
                    <button
                      onClick={onClose}
                      className="px-6 py-3 bg-amber-800 text-white rounded-xl font-bold hover:bg-amber-700 transition-all dark:hover:bg-amber-600"
                    >
                      {t("browseBooks")}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item, i) => (
                      <div
                        key={i}
                        className="flex gap-4 bg-gray-50 dark:bg-white/5 hover:bg-amber-50 dark:hover:bg-white/10 rounded-2xl p-4 transition-colors group"
                      >
                        <div className="w-20 h-28 flex-shrink-0 bg-white dark:bg-dark-bg rounded-xl p-2 shadow-sm flex items-center justify-center">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-auto object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full mb-1">
                                {item.selectedFormat}
                              </span>
                              <h4
                                className="font-black text-gray-900 dark:text-white text-sm line-clamp-2 leading-snug"
                                style={{ fontFamily: "Merriweather, serif" }}
                              >
                                {item.title}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                by {item.author}
                              </p>
                              <div className="flex items-center gap-1 mt-1">
                                {[...Array(5)].map((_, j) => (
                                  <FaStar
                                    key={j}
                                    size={10}
                                    className={
                                      j < Math.round(item.rating)
                                        ? "text-amber-400"
                                        : "text-gray-200 dark:text-white/10"
                                    }
                                  />
                                ))}
                                <span className="text-xs text-gray-450 dark:text-gray-500">
                                  ({item.rating})
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                removeFromCart(item.id, item.selectedFormat)
                              }
                              className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0 w-7 h-7 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                            >
                              <FaTimes size={13} />
                            </button>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border-2 border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-dark-card overflow-hidden">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.selectedFormat,
                                    item.quantity - 1,
                                  )
                                }
                                className="px-3 py-2 hover:bg-amber-50 dark:hover:bg-white/5 transition-colors text-gray-600 dark:text-gray-400 font-bold"
                              >
                                −
                              </button>
                              <span className="w-10 text-center text-sm font-black text-gray-900 dark:text-white">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.selectedFormat,
                                    item.quantity + 1,
                                  )
                                }
                                className="px-3 py-2 hover:bg-amber-50 dark:hover:bg-white/5 transition-colors text-gray-600 dark:text-gray-400 font-bold"
                              >
                                +
                              </button>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-gray-900 dark:text-white text-lg">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                              {item.quantity > 1 && (
                                <p className="text-xs text-gray-500 dark:text-gray-450">
                                  ${item.price.toFixed(2)} each
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {cart.length > 0 && (
                  <div className="mt-8 flex gap-3">
                    <button
                      onClick={onClose}
                      className="flex-1 py-4 border-2 border-gray-200 dark:border-white/10 rounded-xl font-bold text-gray-700 dark:text-white hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {t("continueShopping")}
                    </button>
                    <button
                      onClick={nextStep}
                      disabled={cart.length === 0}
                      className="flex-[2] py-4 bg-amber-800 hover:bg-amber-700 dark:hover:bg-amber-600 text-white rounded-xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-amber-900/20 transition-all disabled:opacity-40 cursor-pointer"
                    >
                      {t("proceedCheckout")} <FaArrowRight />
                    </button>
                  </div>
                )}
              </div>
              <OrderSummary />
            </div>
          )}

          {/* ── ADDRESS ── */}
          {step === "address" && (
            <div className="grid lg:grid-cols-5">
              <div className="lg:col-span-3 p-6 md:p-8">
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 text-gray-500 hover:text-amber-800 dark:hover:text-amber-400 mb-6 text-sm font-semibold transition-colors"
                >
                  <FaArrowLeft size={12} /> Back to Cart
                </button>
                <h2
                  className="text-2xl font-black text-gray-900 dark:text-white mb-2"
                  style={{ fontFamily: "Merriweather, serif" }}
                >
                  Shipping Address
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                  Where should we deliver your books?
                </p>
                <div className="flex gap-3 mb-6">
                  {[
                    { id: "home", icon: FaHome, label: "Home" },
                    { id: "work", icon: FaBuilding, label: "Work" },
                  ].map(({ id, icon: Icon, label }) => (
                    <button
                      key={id}
                      onClick={() =>
                        setAddress({
                          ...address,
                          addressType: id as "home" | "work",
                        })
                      }
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 font-semibold transition-all text-sm ${address.addressType === id ? "border-amber-700 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400" : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-gray-300 cursor-pointer"}`}
                    >
                      <Icon size={14} /> {label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      First Name *
                    </label>
                    <div className="relative">
                      <FaUser
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        size={13}
                      />
                      <input
                        type="text"
                        placeholder="Hak"
                        value={address.firstName}
                        onChange={(e) => {
                          setAddress({ ...address, firstName: e.target.value });
                          setAddressErrors({ ...addressErrors, firstName: "" });
                        }}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors dark:text-white ${addressErrors.firstName ? "border-red-400 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-white/10 bg-white dark:bg-dark-card focus:border-amber-500"}`}
                      />
                    </div>
                    {addressErrors.firstName && (
                      <p className="text-xs text-red-500 mt-1">
                        {addressErrors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Hai"
                      value={address.lastName}
                      onChange={(e) => {
                        setAddress({ ...address, lastName: e.target.value });
                        setAddressErrors({ ...addressErrors, lastName: "" });
                      }}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors dark:text-white ${addressErrors.lastName ? "border-red-400 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-white/10 bg-white dark:bg-dark-card focus:border-amber-500"}`}
                    />
                    {addressErrors.lastName && (
                      <p className="text-xs text-red-500 mt-1">
                        {addressErrors.lastName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <FaEnvelope
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        size={13}
                      />
                      <input
                        type="email"
                        placeholder="hai123@email.com"
                        value={address.email}
                        onChange={(e) => {
                          setAddress({ ...address, email: e.target.value });
                          setAddressErrors({ ...addressErrors, email: "" });
                        }}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors dark:text-white ${addressErrors.email ? "border-red-400 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-white/10 bg-white dark:bg-dark-card focus:border-amber-500"}`}
                      />
                    </div>
                    {addressErrors.email && (
                      <p className="text-xs text-red-500 mt-1">
                        {addressErrors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <FaPhone
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        size={13}
                      />
                      <input
                        type="tel"
                        placeholder="+885 555 000-0000"
                        value={address.phone}
                        onChange={(e) => {
                          setAddress({ ...address, phone: e.target.value });
                          setAddressErrors({ ...addressErrors, phone: "" });
                        }}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors dark:text-white ${addressErrors.phone ? "border-red-400 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-white/10 bg-white dark:bg-dark-card focus:border-amber-500"}`}
                      />
                    </div>
                    {addressErrors.phone && (
                      <p className="text-xs text-red-500 mt-1">
                        {addressErrors.phone}
                      </p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Street Address *
                    </label>
                    <div className="relative">
                      <FaMapMarkerAlt
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        size={13}
                      />
                      <input
                        type="text"
                        placeholder="123 Reading Lane"
                        value={address.line1}
                        onChange={(e) => {
                          setAddress({ ...address, line1: e.target.value });
                          setAddressErrors({ ...addressErrors, line1: "" });
                        }}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors dark:text-white ${addressErrors.line1 ? "border-red-400 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-white/10 bg-white dark:bg-dark-card focus:border-amber-500"}`}
                      />
                    </div>
                    {addressErrors.line1 && (
                      <p className="text-xs text-red-500 mt-1">
                        {addressErrors.line1}
                      </p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Apartment, Suite, etc.{" "}
                      <span className="text-gray-400 font-normal">
                        (optional)
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="Apt 4B"
                      value={address.line2}
                      onChange={(e) =>
                        setAddress({ ...address, line2: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-dark-card focus:border-amber-500 dark:text-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      placeholder="Phnom Penh"
                      value={address.city}
                      onChange={(e) => {
                        setAddress({ ...address, city: e.target.value });
                        setAddressErrors({ ...addressErrors, city: "" });
                      }}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors dark:text-white ${addressErrors.city ? "border-red-400 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-white/10 bg-white dark:bg-dark-card focus:border-amber-500"}`}
                    />
                    {addressErrors.city && (
                      <p className="text-xs text-red-500 mt-1">
                        {addressErrors.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Province *
                    </label>
                    <input
                      type="text"
                      placeholder="Phnom Penh"
                      value={address.state}
                      onChange={(e) => {
                        setAddress({ ...address, state: e.target.value });
                        setAddressErrors({ ...addressErrors, state: "" });
                      }}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors dark:text-white ${addressErrors.state ? "border-red-400 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-white/10 bg-white dark:bg-dark-card focus:border-amber-500"}`}
                    />
                    {addressErrors.state && (
                      <p className="text-xs text-red-500 mt-1">
                        {addressErrors.state}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      placeholder="12000"
                      value={address.zip}
                      onChange={(e) => {
                        setAddress({ ...address, zip: e.target.value });
                        setAddressErrors({ ...addressErrors, zip: "" });
                      }}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors dark:text-white ${addressErrors.zip ? "border-red-400 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-white/10 bg-white dark:bg-dark-card focus:border-amber-500"}`}
                    />
                    {addressErrors.zip && (
                      <p className="text-xs text-red-500 mt-1">
                        {addressErrors.zip}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Country
                    </label>
                    <select
                      value={address.country}
                      onChange={(e) =>
                        setAddress({ ...address, country: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-amber-500 transition-colors appearance-none bg-white dark:bg-dark-card dark:text-white"
                    >
                      {[
                        "Cambodia",
                        "United States",
                        "Canada",
                        "China",
                        "United Kingdom",
                        "Australia",
                        "Germany",
                        "France",
                        "Spain",
                        "Italy",
                        "Netherlands",
                        "Japan",
                      ].map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <label className="flex items-center gap-3 mt-5 cursor-pointer p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors">
                  <input
                    type="checkbox"
                    checked={address.saveAddress}
                    onChange={(e) =>
                      setAddress({ ...address, saveAddress: e.target.checked })
                    }
                    className="w-4 h-4 accent-amber-700"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Save this address for future orders
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      We'll securely store your address for faster checkout next
                      time
                    </p>
                  </div>
                </label>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={prevStep}
                    className="px-6 py-4 border-2 border-gray-200 dark:border-white/10 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <FaArrowLeft size={13} /> Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="flex-1 py-4 bg-amber-800 hover:bg-amber-700 text-white rounded-xl font-black flex items-center justify-center gap-3 shadow-xl shadow-amber-900/20 transition-all cursor-pointer"
                  >
                    Continue to Shipping <FaArrowRight />
                  </button>
                </div>
              </div>
              <OrderSummary />
            </div>
          )}

          {/* ── SHIPPING ── */}
          {step === "shipping" && (
            <div className="grid lg:grid-cols-5">
              <div className="lg:col-span-3 p-6 md:p-8">
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 text-gray-500 hover:text-amber-800 mb-6 text-sm font-semibold transition-colors"
                >
                  <FaArrowLeft size={12} /> Back to Address
                </button>
                <h2
                  className="text-2xl font-black text-gray-900 dark:text-white mb-2"
                  style={{ fontFamily: "Merriweather, serif" }}
                >
                  Shipping Method
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                  Choose how fast you want your books delivered
                </p>
                <div className="bg-amber-50 dark:bg-white/5 rounded-2xl p-4 mb-6 flex items-start gap-3 border border-amber-100 dark:border-white/5">
                  <FaMapMarkerAlt
                    className="text-amber-700 dark:text-amber-400 mt-0.5 flex-shrink-0"
                    size={16}
                  />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 dark:text-white text-sm">
                      {address.firstName} {address.lastName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {address.line1}
                      {address.line2 ? `, ${address.line2}` : ""}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {address.city}, {address.state} {address.zip}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{address.country}</p>
                  </div>
                  <button
                    onClick={() => setStep("address")}
                    className="text-amber-700 dark:text-amber-400 text-xs font-bold hover:underline flex-shrink-0"
                  >
                    Edit
                  </button>
                </div>
                <div className="space-y-3">
                  {SHIPPING_METHODS.map((method) => {
                    const cost = method.price();
                    const isSelected = shipMethod === method.id;
                    const Icon = method.icon;
                    return (
                      <label
                        key={method.id}
                        className={`flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all ${isSelected ? "border-amber-700 bg-amber-50 dark:bg-amber-900/20 shadow-md" : "border-gray-200 dark:border-white/10 hover:border-amber-300 dark:hover:border-white/20 hover:bg-amber-50/30"}`}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          value={method.id}
                          checked={isSelected}
                          onChange={() => setShipMethod(method.id)}
                          className="w-5 h-5 accent-amber-700"
                        />
                        <Icon
                          size={24}
                          className="text-amber-700 dark:text-amber-400 flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-gray-900 dark:text-white">
                              {method.name}
                            </p>
                            {method.badge && (
                              <span
                                className={`px-2 py-0.5 text-xs font-bold rounded-full ${method.badge === "Popular" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" : method.badge === "Fastest" ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"}`}
                              >
                                {method.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {method.subtitle}
                          </p>
                          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1 mt-0.5">
                            <FaCalendarAlt size={11} /> {method.time}
                          </p>
                        </div>
                        <span
                          className={`text-lg font-black flex-shrink-0 ${cost === 0 ? "text-emerald-600" : "text-gray-900 dark:text-white"}`}
                        >
                          {cost === 0 ? "FREE" : `$${cost.toFixed(2)}`}
                        </span>
                      </label>
                    );
                  })}
                </div>
                <div className="mt-6 bg-blue-50 rounded-2xl p-4 flex items-center gap-3"></div>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={prevStep}
                    className="px-6 py-4 border-2 border-gray-200 dark:border-white/10 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <FaArrowLeft size={13} /> Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="flex-1 py-4 bg-amber-800 hover:bg-amber-700 text-white rounded-xl font-black flex items-center justify-center gap-3 shadow-xl shadow-amber-900/20 transition-all cursor-pointer"
                  >
                    Continue to Payment <FaArrowRight />
                  </button>
                </div>
              </div>
              <OrderSummary />
            </div>
          )}

          {/* ── PAYMENT ── */}
          {step === "payment" && (
            <div className="grid lg:grid-cols-5">
              <div className="lg:col-span-3 p-6 md:p-8">
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 text-gray-500 hover:text-amber-800 mb-6 text-sm font-semibold transition-colors"
                >
                  <FaArrowLeft size={12} /> Back to Shipping
                </button>
                <h2
                  className="text-2xl font-black text-gray-900 dark:text-white mb-2"
                  style={{ fontFamily: "Merriweather, serif" }}
                >
                  Payment
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                  All transactions are secure and encrypted
                </p>

                {/* Payment method selector */}
                <PaymentSelector />

                {/* QR Code Payment View for all methods */}
                {payMethod && !showQR && (
                  <div className="flex flex-col items-center justify-center py-12 px-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10 mt-6">
                    <p className="text-gray-500 dark:text-gray-400 text-center mb-6 max-w-sm">
                      Please review your payment amount of <span className="font-bold text-amber-700">${total.toFixed(2)}</span>. A unique QR code will be generated for your transaction.
                    </p>
                    <button
                      onClick={() => setShowQR(true)}
                      className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-95"
                    >
                      Generate QR Code
                    </button>
                  </div>
                )}

                {payMethod && showQR && (
                  <div className="space-y-4 mt-6 animate-fadeIn">
                    <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-5 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 dark:bg-white/10">
                        <div
                          className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
                          style={{ width: `${(timeLeft / 600) * 100}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between gap-3 mb-4 pt-2">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            Scan to Pay
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Use your mobile banking app to scan the QR code below
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Expires in</p>
                          <p className={`text-lg font-black font-mono ${timeLeft < 60 ? "text-red-500 animate-pulse" : "text-blue-600 dark:text-blue-400"}`}>
                            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center gap-4 relative">
                        {timeLeft === 0 && (
                          <div className="absolute inset-0 z-10 bg-white/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                            <p className="text-xl font-black text-red-600 mb-2">QR Code Expired</p>
                            <p className="text-sm text-gray-500 mb-4">Please generate a new QR code to complete your payment.</p>
                            <button
                              onClick={() => {
                                setTimeLeft(600);
                                setShowQR(true);
                              }}
                              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm"
                            >
                              Generate New QR
                            </button>
                          </div>
                        )}
                        <div className={`w-64 h-64 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center p-4 transition-opacity duration-500 ${timeLeft === 0 ? "opacity-20" : "opacity-100"}`}>
                          <img
                            src="/qr.png"
                            alt="Payment QR Code"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"; // fallback if qr.png is missing
                            }}
                          />
                        </div>
                        <p className={`text-sm font-semibold text-gray-700 transition-opacity duration-500 ${timeLeft === 0 ? "opacity-20" : "opacity-100"}`}>
                          Amount to pay: <span className="text-amber-700 font-bold">${total.toFixed(2)}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={prevStep}
                    className="px-6 py-4 border-2 border-gray-200 dark:border-white/10 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <FaArrowLeft size={13} /> Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="flex-1 py-4 bg-amber-800 hover:bg-amber-700 text-white rounded-xl font-black flex items-center justify-center gap-3 shadow-xl shadow-amber-900/20 transition-all cursor-pointer"
                  >
                    Review Order <FaArrowRight />
                  </button>
                </div>
              </div>
              <OrderSummary />
            </div>
          )}

          {/* ── REVIEW ── */}
          {step === "review" && (
            <div className="grid lg:grid-cols-5">
              <div className="lg:col-span-3 p-6 md:p-8">
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-amber-800 dark:hover:text-amber-400 mb-6 text-sm font-semibold transition-colors"
                >
                  <FaArrowLeft size={12} /> {t("backToPayment")}
                </button>
                <h2
                  className="text-2xl font-black text-gray-900 dark:text-white mb-2"
                  style={{ fontFamily: "Merriweather, serif" }}
                >
                  {t("reviewOrder")}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                  {t("confirmDetails")}
                </p>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-white/5 border dark:border-white/5 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <FaMapMarkerAlt className="text-amber-700 dark:text-amber-400" /> Delivery
                        Address
                      </h3>
                      <button
                        onClick={() => setStep("address")}
                        className="text-xs text-amber-700 dark:text-amber-400 font-bold hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-gray-700 dark:text-gray-200 font-semibold">
                      {address.firstName} {address.lastName}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {address.line1}
                      {address.line2 ? `, ${address.line2}` : ""}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {address.city}, {address.state} {address.zip},{" "}
                      {address.country}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                      {address.email} · {address.phone}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-white/5 border dark:border-white/5 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <FaTruck className="text-amber-700 dark:text-amber-400" /> Shipping Method
                      </h3>
                      <button
                        onClick={() => setStep("shipping")}
                        className="text-xs text-amber-700 dark:text-amber-400 font-bold hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                          {selectedShipping?.name}
                        </p>
                        <p className="text-sm text-amber-700 dark:text-amber-400 font-bold">
                          {selectedShipping?.time}
                        </p>
                        {shipMethod !== "pickup" && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Estimated:{" "}
                            {deliveryDate.toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                      <span
                        className={`font-black text-lg ${shippingCost === 0 ? "text-emerald-600" : "text-gray-900 dark:text-white"}`}
                      >
                        {shippingCost === 0
                          ? "FREE"
                          : `$${shippingCost.toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-white/5 border dark:border-white/5 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <FaCreditCard className="text-amber-700 dark:text-amber-400" /> Payment
                      </h3>
                      <button
                        onClick={() => setStep("payment")}
                        className="text-xs text-amber-700 dark:text-amber-400 font-bold hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          PAYMENT_METHODS.find((m) => m.id === payMethod)
                            ?.logo ?? ""
                        }
                        alt={
                          PAYMENT_METHODS.find((m) => m.id === payMethod)
                            ?.label
                        }
                        className="h-7 w-auto object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display =
                            "none";
                        }}
                      />
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                          {
                            PAYMENT_METHODS.find((m) => m.id === payMethod)
                              ?.label
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-white/5 border dark:border-white/5 rounded-2xl p-5">
                    <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                      <FaBox className="text-amber-700 dark:text-amber-400" /> Items (
                      {cart.reduce((s, i) => s + i.quantity, 0)})
                    </h3>
                    <div className="space-y-3">
                      {cart.map((item, i) => (
                        <div key={i} className="flex gap-3 items-center">
                          <div className="w-10 h-14 flex-shrink-0 bg-white dark:bg-dark-card rounded-lg p-1 shadow-sm flex items-center justify-center">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-full w-auto object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1"
                              style={{ fontFamily: "Merriweather, serif" }}
                            >
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {item.selectedFormat} · Quantity {item.quantity}
                            </p>
                          </div>
                          <p className="font-black text-gray-900 dark:text-white text-sm flex-shrink-0">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950/20 rounded-2xl p-5 border border-amber-200 dark:border-amber-900/30">
                    <h3 className="font-black text-gray-900 dark:text-white mb-3">
                      Price Breakdown
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                        <span className="font-semibold dark:text-white">
                          ${cartTotal.toFixed(2)}
                        </span>
                      </div>
                      {promoApplied && (
                        <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                          <span>Promo ({promoCode})</span>
                          <span className="font-bold">
                            -${discountAmount.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Shipping</span>
                        <span
                          className={`font-semibold ${shippingCost === 0 ? "text-emerald-600 dark:text-emerald-400" : "dark:text-white"}`}
                        >
                          {shippingCost === 0
                            ? "FREE"
                            : `$${shippingCost.toFixed(2)}`}
                        </span>
                      </div>
                      {giftWrap && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Gift Wrap</span>
                          <span className="font-semibold dark:text-white">$4.99</span>
                        </div>
                      )}

                      <div className="flex justify-between text-lg font-black pt-2 border-t border-amber-200 dark:border-amber-900/30">
                        <span className="dark:text-white">Total Charged</span>
                        <span className="text-amber-900 dark:text-amber-400">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    onClick={placeOrder}
                    disabled={processing}
                    className="w-full py-5 bg-gradient-to-r from-amber-800 to-amber-600 hover:from-amber-700 hover:to-amber-500 disabled:opacity-70 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all shadow-2xl shadow-amber-900/30 group cursor-pointer"
                  >
                    {processing ? (
                      <>
                        <FaSpinner className="animate-spin" size={20} />{" "}
                        Processing Your Order...
                      </>
                    ) : (
                      <>
                        Place Order · ${total.toFixed(2)}{" "}
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
              <OrderSummary />
            </div>
          )}

          {/* ── CONFIRMATION ── */}
          {step === "confirmation" && orderDone && (
            <div className="p-6 md:p-12 text-center max-w-2xl mx-auto">
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-xl">
                  <FaCheck className="text-emerald-600 text-5xl" />
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-400/20 rounded-full animate-ping" />
              </div>
              <h2
                className="text-4xl font-black text-gray-900 dark:text-white mb-3 flex items-center gap-3"
                style={{ fontFamily: "Merriweather, serif" }}
              >
                <Sparkles size={32} className="text-amber-500" />
                {t("orderConfirmed")}!
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-8">
                {t("booksOnWay").replace("{{name}}", address.firstName)}
              </p>


              {/* Invoice Section */}
              <div className="print-invoice bg-white dark:bg-dark-card rounded-3xl p-8 mb-8 text-left shadow-lg border border-gray-100 dark:border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-800 to-amber-600" />
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <img src="/logo.png" alt="Khmer Bookstore" className="h-12 w-12 object-contain" />
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2 mb-1" style={{ fontFamily: "Merriweather, serif" }}>
                        INVOICE
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">#{orderNumber}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-bold transition-colors cursor-pointer print:hidden"
                  >
                    <FaPrinter size={14} /> Print
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-2">Billed To</p>
                    <p className="font-bold text-gray-900 dark:text-white">{address.firstName} {address.lastName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{address.email}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{address.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-2">Date</p>
                    <p className="font-bold text-gray-900 dark:text-white">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="mb-8 overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[400px]">
                    <thead>
                      <tr className="border-b-2 border-gray-100 dark:border-white/10">
                        <th className="py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item</th>
                        <th className="py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Qty</th>
                        <th className="py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                      {cart.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-4">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{item.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.author}</p>
                          </td>
                          <td className="py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {item.quantity}
                          </td>
                          <td className="py-4 text-right text-sm font-bold text-gray-900 dark:text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end">
                  <div className="w-full sm:w-64 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                      <span className="font-semibold text-gray-900 dark:text-white">${cartTotal.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
                        <span>Discount</span>
                        <span className="font-semibold">-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-lg font-black pt-4 border-t-2 border-gray-100 dark:border-white/10 mt-2">
                      <span className="text-gray-900 dark:text-white">Total</span>
                      <span className="text-amber-800 dark:text-amber-400">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 mb-8 text-left">
                <FaEnvelope
                  className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
                  size={18}
                />
                <div>
                  <p className="font-bold text-blue-900 dark:text-blue-300 text-sm">
                    {t("confirmationEmail")}
                  </p>
                  <p className="text-blue-600 dark:text-blue-400 text-sm">
                    {t("sentOrderDetails")} <strong>{address.email}</strong>
                  </p>
                </div>
              </div>

              {/* ── Action buttons — navigate to real pages ── */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleContinueShopping}
                  className="flex-1 py-4 bg-amber-800 hover:bg-amber-700 dark:hover:bg-amber-600 text-white rounded-xl font-black transition-all shadow-xl cursor-pointer flex items-center justify-center gap-2"
                >
                   {t("continueShopping")}
                </button>
                <button
                  onClick={handleTrackOrder}
                  className="flex-1 py-4 border-2 border-amber-800 dark:border-amber-400 text-amber-800 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl font-black transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                   {t("trackOrder")}
                </button>
              </div>

              <p className="text-xs text-gray-400 dark:text-gray-500 mt-6">
                {t("needHelp")}{" "}
                <a
                  href="mailto:support@KhmerBookStore.com"
                  className="text-amber-700 dark:text-amber-400 hover:underline"
                >
                  support@KhmerBookStore.com
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
