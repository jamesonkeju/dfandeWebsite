import { Outlet } from "react-router-dom";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";

export function MainLayout() {
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
