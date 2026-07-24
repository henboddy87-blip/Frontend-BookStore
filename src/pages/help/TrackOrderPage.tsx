import { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { PageLayout } from '../../components/PageLayout';
import { PageHero } from './HelpShared';

export function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "found" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber || !email) return;
    
    setStatus("loading");
    // Simulate API call
    setTimeout(() => {
      if (orderNumber.startsWith("BK") && email.includes("@")) {
        setStatus("found");
      } else {
        setStatus("error");
      }
    }, 1500);
  };

  return (
    <PageLayout>
      <PageHero
        icon={MapPin}
        title="Track Your Order"
        subtitle="Enter your order details below to see the current shipping status."
        crumb="Track Order"
      />
      
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white dark:bg-dark-card border border-amber-100 dark:border-white/5 rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="orderNumber" className="block text-sm font-bold text-amber-950 dark:text-gray-300 mb-2">
                Order Number
              </label>
              <input
                id="orderNumber"
                type="text"
                placeholder="e.g. BK-123456789"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-amber-200 dark:border-white/10 bg-white dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow dark:text-white"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-amber-950 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="The email used for the order"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-amber-200 dark:border-white/10 bg-white dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow dark:text-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
            >
              {status === "loading" ? (
                "Searching..."
              ) : (
                <>
                  <Search size={20} />
                  Track Order
                </>
              )}
            </button>
          </form>

          {status === "error" && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-900/30 text-sm font-medium text-center">
              We couldn't find an order matching those details. Please check and try again.
            </div>
          )}

          {status === "found" && (
            <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-700/30">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-amber-200/50 dark:border-white/10">
                <span className="font-bold text-amber-950 dark:text-white">Order: {orderNumber}</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-bold uppercase tracking-wider">
                  In Transit
                </span>
              </div>
              <p className="text-sm text-amber-900/80 dark:text-amber-200/70 mb-2">
                <strong>Expected Delivery:</strong> {new Date(Date.now() + 86400000 * 3).toLocaleDateString()}
              </p>
              <p className="text-sm text-amber-900/80 dark:text-amber-200/70">
                <strong>Latest Update:</strong> Package has left the sorting facility.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
