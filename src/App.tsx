/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminSidebar } from "@/components/AdminSidebar";
import { HomePage } from "@/pages/HomePage";
import { DestinationPage } from "@/pages/DestinationPage";
import { OnboardingPage } from "@/pages/OnboardingPage";
import { PackagesPage } from "@/pages/PackagesPage";
import { ConciergePage } from "@/pages/ConciergePage";
import { TripBuilderPage } from "@/pages/TripBuilderPage";
import { ItineraryPage } from "@/pages/ItineraryPage";
import { PaymentsPage } from "@/pages/PaymentsPage";
import { AdminPaymentsPage } from "@/pages/AdminPaymentsPage";
import { AdminLeadsPage } from "@/pages/AdminLeadsPage";
import { AdminLeadDetailPage } from "@/pages/AdminLeadDetailPage";
import { AdminContentPage } from "@/pages/AdminContentPage";
import { AdminDestinationDetailPage } from "@/pages/AdminDestinationDetailPage";
import { AdminPackageDetailPage } from "@/pages/AdminPackageDetailPage";
import AdminStayDetailPage from "@/pages/AdminStayDetailPage";
import AdminExperienceDetailPage from "@/pages/AdminExperienceDetailPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import { AdminLoginPage } from "@/pages/AdminLoginPage";
import { AdminGuard } from "@/components/AdminGuard";
import { NotFoundPage } from "@/pages/NotFoundPage";

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isLoginPage = location.pathname === "/admin/login";

  if (isAdminRoute && !isLoginPage) {
    return (
      <div className="flex min-h-screen bg-bg-warm font-sans antialiased text-text-main">
        <AdminSidebar />
        <div className="flex-grow ml-72">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-warm text-text-main font-sans antialiased">
      {!isAdminRoute && <Header />}
      {children}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:destinationId" element={<DestinationPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/concierge" element={<ConciergePage />} />
          <Route path="/trip-builder" element={<TripBuilderPage />} />
          <Route path="/itinerary/:leadId" element={<ItineraryPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminGuard><AdminDashboardPage /></AdminGuard>} />
          <Route path="/admin/payments/:paymentId" element={<AdminGuard><AdminPaymentsPage /></AdminGuard>} />
          <Route path="/admin/leads" element={<AdminGuard><AdminLeadsPage /></AdminGuard>} />
          <Route path="/admin/leads/:id" element={<AdminGuard><AdminLeadDetailPage /></AdminGuard>} />
          <Route path="/admin/content" element={<AdminGuard><AdminContentPage /></AdminGuard>} />
          <Route path="/admin/content/destinations/:id" element={<AdminGuard><AdminDestinationDetailPage /></AdminGuard>} />
          <Route path="/admin/content/packages/:id" element={<AdminGuard><AdminPackageDetailPage /></AdminGuard>} />
          <Route path="/admin/content/stays/:id" element={<AdminGuard><AdminStayDetailPage /></AdminGuard>} />
          <Route path="/admin/content/experiences/:id" element={<AdminGuard><AdminExperienceDetailPage /></AdminGuard>} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

