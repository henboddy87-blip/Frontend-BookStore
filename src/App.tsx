import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./context/StoreContext";
import { ScrollToTop } from "./components/ScrollToTop";
import { HomePage } from "./pages/HomePage";
import { ProfilePage } from "./pages/ProfilePage";

// Shop Pages
import {
  AllBooksPage,
  NewArrivalsPage,
  BestsellersPage,
  OnSalePage,
  AwardWinnersPage,
  BookBundlesPage,
} from "./pages/shop";

// Genre Pages
import {
  FictionPage,
  NonFictionPage,
  SelfHelpPage,
  BiographyPage,
  ChildrensPage,
  ScienceFictionPage,
  TechnologyPage,
  KhmerLiteraturePage,
  NovelPage,
  HealthPage,
  FinancePage,
  ArtPage,
} from "./pages/genre";

// Help Pages
import {
  FAQPage,
  ShippingInfoPage,
  ReturnsPage,
  TrackOrderPage,
  GiftCardsPage,
  ContactUsPage,
} from "./pages/help";

// Legal Pages
import {
  PrivacyPolicyPage,
  TermsOfServicePage,
  CookiePolicyPage,
  AccessibilityPage,
} from "./pages/legal";

// Removed inline HomePage implementation

export function App() {
  return (
    <BrowserRouter basename="/Frontend-BookStore">
      <ScrollToTop />
      <StoreProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/books" element={<AllBooksPage />} />
          <Route path="/new-arrivals" element={<NewArrivalsPage />} />
          <Route path="/bestsellers" element={<BestsellersPage />} />
          <Route path="/on-sale" element={<OnSalePage />} />
          <Route path="/award-winners" element={<AwardWinnersPage />} />
          <Route path="/book-bundles" element={<BookBundlesPage />} />
          <Route path="/genre/fiction" element={<FictionPage />} />
          <Route path="/genre/non-fiction" element={<NonFictionPage />} />
          <Route path="/genre/self-help" element={<SelfHelpPage />} />
          <Route path="/genre/biography" element={<BiographyPage />} />
          <Route path="/genre/children" element={<ChildrensPage />} />
          <Route path="/genre/science" element={<ScienceFictionPage />} />
          <Route path="/genre/technology" element={<TechnologyPage />} />
          <Route
            path="/genre/khmer-literature"
            element={<KhmerLiteraturePage />}
          />
          <Route path="/genre/novel" element={<NovelPage />} />
          <Route path="/genre/health" element={<HealthPage />} />
          <Route path="/genre/finance" element={<FinancePage />} />
          <Route path="/genre/art" element={<ArtPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/shipping" element={<ShippingInfoPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/gift-cards" element={<GiftCardsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />

          {/* Legal Pages */}
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
          <Route path="/accessibility" element={<AccessibilityPage />} />
        </Routes>
      </StoreProvider>
    </BrowserRouter>
  );
}
