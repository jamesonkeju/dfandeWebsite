import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { HomePage } from "@/features/home/HomePage";
import { AboutPage } from "@/features/about/AboutPage";
import { ServicesListPage } from "@/features/services/ServicesListPage";
import { ServiceDetailPage } from "@/features/services/ServiceDetailPage";
import { ProductsPage } from "@/features/products/ProductsPage";
import { ProjectsPage } from "@/features/projects/ProjectsPage";
import { GalleryPage } from "@/features/gallery/GalleryPage";
import { CertificationsPage } from "@/features/certifications/CertificationsPage";
import { CareersPage } from "@/features/careers/CareersPage";
import { ContactPage } from "@/features/contact/ContactPage";
import { ComingSoonPage } from "@/features/home/ComingSoonPage";
import { LoginPage } from "@/features/admin/auth/LoginPage";
import { ProtectedRoute } from "@/features/admin/ProtectedRoute";

// The admin CMS (Formik/Yup forms, and now TipTap's rich-text editor) is
// only ever loaded by authenticated staff — code-split it out of the
// public marketing site's bundle rather than shipping it to every visitor.
const AdminLayout = lazy(() => import("@/layouts/AdminLayout").then((m) => ({ default: m.AdminLayout })));
const DashboardPage = lazy(() => import("@/features/admin/dashboard/DashboardPage").then((m) => ({ default: m.DashboardPage })));
const ContactInboxPage = lazy(() => import("@/features/admin/contact/ContactInboxPage").then((m) => ({ default: m.ContactInboxPage })));
const AdminServicesListPage = lazy(() => import("@/features/admin/services/ServicesListPage").then((m) => ({ default: m.ServicesListPage })));
const ServiceFormPage = lazy(() => import("@/features/admin/services/ServiceFormPage").then((m) => ({ default: m.ServiceFormPage })));
const AdminProductsListPage = lazy(() => import("@/features/admin/products/ProductsListPage").then((m) => ({ default: m.ProductsListPage })));
const ProductFormPage = lazy(() => import("@/features/admin/products/ProductFormPage").then((m) => ({ default: m.ProductFormPage })));
const AdminProjectsListPage = lazy(() => import("@/features/admin/projects/ProjectsListPage").then((m) => ({ default: m.ProjectsListPage })));
const ProjectFormPage = lazy(() => import("@/features/admin/projects/ProjectFormPage").then((m) => ({ default: m.ProjectFormPage })));
const ContentBlocksPage = lazy(() => import("@/features/admin/content/ContentBlocksPage").then((m) => ({ default: m.ContentBlocksPage })));

function AdminSuspense({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="p-8 text-sm text-ink-soft">Loading…</div>}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/services", element: <ServicesListPage /> },
      { path: "/services/:slug", element: <ServiceDetailPage /> },
      { path: "/products", element: <ProductsPage /> },
      { path: "/projects", element: <ProjectsPage /> },
      { path: "/gallery", element: <GalleryPage /> },
      { path: "/certifications", element: <CertificationsPage /> },
      { path: "/careers", element: <CareersPage /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "*", element: <ComingSoonPage /> },
    ],
  },
  { path: "/admin/login", element: <LoginPage /> },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminSuspense>
          <AdminLayout />
        </AdminSuspense>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "contact", element: <ContactInboxPage /> },
      { path: "services", element: <AdminServicesListPage /> },
      { path: "services/new", element: <ServiceFormPage /> },
      { path: "services/:id/edit", element: <ServiceFormPage /> },
      { path: "products", element: <AdminProductsListPage /> },
      { path: "products/new", element: <ProductFormPage /> },
      { path: "products/:id/edit", element: <ProductFormPage /> },
      { path: "projects", element: <AdminProjectsListPage /> },
      { path: "projects/new", element: <ProjectFormPage /> },
      { path: "projects/:id/edit", element: <ProjectFormPage /> },
      { path: "content", element: <ContentBlocksPage /> },
      { path: "content/:pageGroup", element: <ContentBlocksPage /> },
    ],
  },
]);
