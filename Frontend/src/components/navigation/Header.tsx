import { useState } from "react";
import { Menu, X, ChevronDown, Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/media/Logo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { primaryNav, contactCta } from "@/data/mock/navigation";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="hidden border-b border-line bg-void text-void-soft lg:block">
        <Container className="flex h-9 items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Mail size={13} /> info@dfande.com
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={13} /> Lagos &amp; Port Harcourt, Nigeria
            </span>
          </div>
          <span className="text-void-soft">ISO 9001 · ISO 14001 · ISO 45001 Certified</span>
        </Container>
      </div>

      <div className="border-b border-line">
        <Container className="flex h-20 items-center justify-between">
          <a href="/" aria-label="DF&E home">
            <Logo height={40} />
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            {primaryNav.map((item) => (
              <div key={item.href} className="group relative">
                <a
                  href={item.href}
                  className="flex items-center gap-1 text-[13px] font-bold uppercase tracking-wide text-ink-soft hover:text-gold-dark"
                >
                  {item.label}
                  {item.children && <ChevronDown size={13} strokeWidth={2.5} />}
                </a>
                {item.children && (
                  <div className="invisible absolute left-0 top-full min-w-[280px] translate-y-1 rounded-md border border-line bg-white p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    {item.children.map((child) => (
                      <a
                        key={child.href}
                        href={child.href}
                        className="block rounded-sm px-3 py-2 text-sm text-ink-soft hover:bg-paper hover:text-gold-dark"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button href={contactCta.href} variant="primary">
              {contactCta.label}
            </Button>
          </div>

          <button
            type="button"
            className="p-2 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </Container>
      </div>

      {mobileOpen && (
        <div className="border-b border-line bg-white lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {primaryNav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-sm px-2 py-2.5 text-sm font-bold uppercase tracking-wide text-ink-soft hover:text-gold-dark"
              >
                {item.label}
              </a>
            ))}
            <Button href={contactCta.href} variant="primary" className="mt-2 w-fit justify-center">
              {contactCta.label}
            </Button>
          </Container>
        </div>
      )}
    </header>
  );
}
