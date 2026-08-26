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
import { FaqPage } from "@/features/faq/FaqPage";
import { ComingSoonPage } from "@/features/home/ComingSoonPage";
import { LoginPage } from "@/features/admin/auth/LoginPage";
import { ForgotPasswordPage } from "@/features/admin/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "@/features/admin/auth/ResetPasswordPage";
import { ProtectedRoute } from "@/features/admin/ProtectedRoute";

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
const AnalyticsPage = lazy(() => import("@/features/admin/analytics/AnalyticsPage").then((m) => ({ default: m.AnalyticsPage })));
const UsersListPage = lazy(() => import("@/features/admin/users/UsersListPage").then((m) => ({ default: m.UsersListPage })));
const AuditLogsPage = lazy(() => import("@/features/admin/audit/AuditLogsPage").then((m) => ({ default: m.AuditLogsPage })));

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
      { path: "/work-experience", element: <ProjectsPage /> },
      { path: "/gallery", element: <GalleryPage /> },
      { path: "/certifications", element: <CertificationsPage /> },
      { path: "/faq", element: <FaqPage /> },
      { path: "/careers", element: <CareersPage /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "*", element: <ComingSoonPage /> },
    ],
  },
  { path: "/admin/login", element: <LoginPage /> },
  { path: "/admin/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/admin/reset-password", element: <ResetPasswordPage /> },
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
      {
        path: "services",
        element: (
          <ProtectedRoute allowedRoles={["SuperAdmin", "ContentManager", "Administrator", "Editor"]}>
            <AdminServicesListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "services/new",
        element: (
          <ProtectedRoute allowedRoles={["SuperAdmin", "ContentManager", "Administrator", "Editor"]}>
            <ServiceFormPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "services/:id/edit",
        element: (
          <ProtectedRoute allowedRoles={["SuperAdmin", "ContentManager", "Administrator", "Editor"]}>
            <ServiceFormPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "products",
        element: (
          <ProtectedRoute allowedRoles={["SuperAdmin", "ContentManager", "Administrator", "Editor"]}>
            <AdminProductsListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "products/new",
        element: (
          <ProtectedRoute allowedRoles={["SuperAdmin", "ContentManager", "Administrator", "Editor"]}>
            <ProductFormPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "products/:id/edit",
        element: (
          <ProtectedRoute allowedRoles={["SuperAdmin", "ContentManager", "Administrator", "Editor"]}>
            <ProductFormPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "projects",
        element: (
          <ProtectedRoute allowedRoles={["SuperAdmin", "ContentManager", "Administrator", "Editor"]}>
            <AdminProjectsListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "projects/new",
        element: (
          <ProtectedRoute allowedRoles={["SuperAdmin", "ContentManager", "Administrator", "Editor"]}>
            <ProjectFormPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "projects/:id/edit",
        element: (
          <ProtectedRoute allowedRoles={["SuperAdmin", "ContentManager", "Administrator", "Editor"]}>
            <ProjectFormPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "content",
        element: (
          <ProtectedRoute allowedRoles={["SuperAdmin", "ContentManager", "Administrator", "Editor"]}>
            <ContentBlocksPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "content/:pageGroup",
        element: (
          <ProtectedRoute allowedRoles={["SuperAdmin", "ContentManager", "Administrator", "Editor"]}>
            <ContentBlocksPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "analytics",
        element: (
          <ProtectedRoute allowedRoles={["SuperAdmin", "ContentManager", "Administrator", "Editor"]}>
            <AnalyticsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <ProtectedRoute allowedRoles={["SuperAdmin"]}>
            <UsersListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "audit-logs",
        element: (
          <ProtectedRoute allowedRoles={["SuperAdmin"]}>
            <AuditLogsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
