import { useState } from "react";
import { Menu, X, ChevronDown, Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/media/Logo";
import { Button } from "@/components/ui/Button";
import { primaryNav, contactCta } from "@/data/mock/navigation";
import { useContent } from "@/features/content/hooks/useContent";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);
  const { getText } = useContent();

  const contactEmail = getText("company.contactEmail", "info@dfande.com");
  const headquarters = getText("company.headquarters", "Lagos & Port Harcourt, Nigeria");

  const toggleSubmenu = (label: string) => {
    setOpenMobileSubmenu(openMobileSubmenu === label ? null : label);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-xs">
      {/* TOP UTILITY BAR */}
      <div className="hidden border-b border-line bg-void text-void-soft lg:block">
        <div className="mx-auto max-w-7xl px-6 md:px-10 flex h-9 items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-6">
            <a
              href={`mailto:${contactEmail}`}
              className="flex items-center gap-1.5 hover:text-gold transition-colors"
            >
              <Mail size={13} className="text-gold" /> {contactEmail}
            </a>
            <span className="flex items-center gap-1.5">
              <MapPin size={13} className="text-gold" /> {headquarters}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-void-soft">ISO 9001:2015 · ISO 14001:2015 · ISO 45001:2018</span>
            <span className="text-void-line">|</span>
            <a href="/faq" className="text-gold hover:underline">
              FAQs
            </a>
          </div>
        </div>
      </div>

      {/* MAIN NAVIGATION BAR */}
      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-6 md:px-10 flex h-20 items-center justify-between gap-4">
          {/* LOGO */}
          <a href="/" aria-label="DF&E home" className="flex-none flex items-center">
            <Logo height={38} />
          </a>

          {/* DESKTOP NAVIGATION MENU */}
          <nav className="hidden items-center gap-4 xl:gap-6 lg:flex">
            {primaryNav.map((item) => (
              <div key={item.label} className="group relative flex items-center h-20">
                <a
                  href={item.href}
                  className="flex items-center gap-1 text-[12.5px] xl:text-[13px] font-bold uppercase tracking-wider text-ink-soft transition-colors hover:text-gold-dark py-2 whitespace-nowrap"
                >
                  <span>{item.label}</span>
                  {item.children && (
                    <ChevronDown
                      size={13}
                      strokeWidth={2.5}
                      className="text-steel transition-transform duration-200 group-hover:rotate-180 group-hover:text-gold-dark"
                    />
                  )}
                </a>

                {/* HOVER DROPDOWN MENU */}
                {item.children && (
                  <div className="invisible absolute left-1/2 top-full -translate-x-1/2 min-w-[280px] rounded-xl border border-line bg-white p-2.5 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100 z-50">
                    <div className="space-y-1">
                      {item.children.map((child) => (
                        <a
                          key={child.href}
                          href={child.href}
                          className="group/child block rounded-lg px-3 py-2 text-left transition-colors hover:bg-paper"
                        >
                          <div className="text-[13px] font-bold text-ink group-hover/child:text-gold-dark transition-colors">
                            {child.label}
                          </div>
                          {child.description && (
                            <div className="mt-0.5 text-[11px] text-steel leading-tight line-clamp-1">
                              {child.description}
                            </div>
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* DESKTOP CTA BUTTON */}
          <div className="hidden lg:flex flex-none items-center">
            <Button href={contactCta.href} variant="primary" className="text-xs px-4.5 py-2.5 whitespace-nowrap">
              {contactCta.label}
            </Button>
          </div>

          {/* MOBILE MENU TOGGLE BUTTON */}
          <button
            type="button"
            className="p-2 text-ink lg:hidden rounded-lg hover:bg-paper transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="border-b border-line bg-white lg:hidden max-h-[calc(100vh-5rem)] overflow-y-auto shadow-xl px-6 py-4">
          <div className="flex flex-col gap-1 divide-y divide-line/60">
            {primaryNav.map((item) => (
              <div key={item.label} className="py-2 first:pt-0">
                {item.children ? (
                  <div>
                    <button
                      type="button"
                      onClick={() => toggleSubmenu(item.label)}
                      className="flex w-full items-center justify-between py-1.5 text-sm font-bold uppercase tracking-wide text-ink hover:text-gold-dark"
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          openMobileSubmenu === item.label ? "rotate-180 text-gold-dark" : "text-steel"
                        }`}
                      />
                    </button>
                    {openMobileSubmenu === item.label && (
                      <div className="mt-1 space-y-1 pl-3 border-l-2 border-gold/40">
                        {item.children.map((child) => (
                          <a
                            key={child.href}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className="block rounded-md px-3 py-2 text-xs font-semibold text-ink-soft hover:bg-paper hover:text-gold-dark"
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-1.5 text-sm font-bold uppercase tracking-wide text-ink hover:text-gold-dark"
                  >
                    {item.label}
                  </a>
                )}
              </div>
            ))}

            <div className="pt-4 border-t border-line">
              <Button href={contactCta.href} variant="primary" className="w-full justify-center">
                {contactCta.label}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
