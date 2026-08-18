import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";

const ROUTE_TITLES: Record<string, string> = {
  "/": "Divine Flame and Energy International Limited",
  "/about": "About Us | Divine Flame and Energy International Limited",
  "/services": "Engineering & Oilfield Services | Divine Flame and Energy International Limited",
  "/products": "Equipment & Spares Catalog | Divine Flame and Energy International Limited",
  "/projects": "Work Experience & Track Record | Divine Flame and Energy International Limited",
  "/work-experience": "Work Experience & Track Record | Divine Flame and Energy International Limited",
  "/certifications": "ISO Certifications & Policies | Divine Flame and Energy International Limited",
  "/faq": "FAQs & Technical Advisory | Divine Flame and Energy International Limited",
  "/careers": "Careers | Divine Flame and Energy International Limited",
  "/contact": "Contact Us | Divine Flame and Energy International Limited",
};

export function MainLayout() {
  const location = useLocation();

  useEffect(() => {
    const matchedTitle = ROUTE_TITLES[location.pathname];
    if (matchedTitle) {
      document.title = matchedTitle;
    } else if (location.pathname.startsWith("/services/")) {
      const slug = location.pathname.replace("/services/", "").replace(/-/g, " ");
      const formatted = slug.charAt(0).toUpperCase() + slug.slice(1);
      document.title = `${formatted} | Divine Flame and Energy International Limited`;
    } else {
      document.title = "Divine Flame and Energy International Limited";
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
