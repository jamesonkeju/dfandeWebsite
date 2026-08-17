import { Logo } from "@/components/media/Logo";
import { Container } from "@/components/layout/Container";
import { company } from "@/data/mock/company";
import { certifications } from "@/data/mock/certifications";
import { primaryNav } from "@/data/mock/navigation";
import { useGetPublishedServicesQuery } from "@/features/services/api/servicesApi";

export function Footer() {
  const year = new Date().getFullYear();
  const { data: services } = useGetPublishedServicesQuery();

  return (
    <footer className="bg-void text-white">
      <Container className="grid gap-10 py-16 md:grid-cols-4">
        <div>
          {/* Source logo has no light/reversed variant — plating it on white
              keeps colors true instead of faking a reversed lockup. */}
          <div className="inline-block rounded-sm bg-white px-3 py-2">
            <Logo height={32} />
          </div>
          <p className="mt-4 max-w-[32ch] text-sm text-void-soft">{company.about}</p>
        </div>

        <div>
          <h4 className="eyebrow mb-4 text-gold">Services</h4>
          <ul className="space-y-2 text-sm text-void-soft">
            {(services ?? []).slice(0, 6).map((s) => (
              <li key={s.slug}>
                <a href={`/services/${s.slug}`} className="hover:text-gold">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="eyebrow mb-4 text-gold">Company</h4>
          <ul className="space-y-2 text-sm text-void-soft">
            {primaryNav
              .filter((n) => !n.children)
              .map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="hover:text-gold">
                    {n.label}
                  </a>
                </li>
              ))}
          </ul>
        </div>

        <div>
          <h4 className="eyebrow mb-4 text-gold">Contact &amp; Certifications</h4>
          <p className="text-sm text-void-soft">info@dfande.com</p>
          <p className="mt-1 text-sm text-void-soft">
            {company.headquarters} · Field facility: {company.fieldFacility}
          </p>
          <ul className="mt-4 space-y-1 text-sm text-void-soft">
            {certifications.map((c) => (
              <li key={c.code}>{c.code}</li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-void-line py-5">
        <Container className="flex flex-col gap-2 text-xs text-void-soft md:flex-row md:items-center md:justify-between">
          <span>
            © {year} {company.legalName}
          </span>
          <div className="flex gap-5">
            <a href="/privacy" className="hover:text-gold">
              Privacy
            </a>
            <a href="/terms" className="hover:text-gold">
              Terms
            </a>
          </div>
        </Container>
      </div>
    </footer>
  );
}
