import { Logo } from "@/components/media/Logo";
import { Container } from "@/components/layout/Container";
import { useGetPublishedServicesQuery } from "@/features/services/api/servicesApi";
import { useContent } from "@/features/content/hooks/useContent";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

type CertItem = {
  code: string;
  label: string;
};

export function Footer() {
  const year = new Date().getFullYear();
  const { data: services } = useGetPublishedServicesQuery();
  const { getText, getJson, getList } = useContent();

  const legalName = getText("company.legalName", "Divine Flame and Energy International Limited");
  const aboutText = getText("company.about", "Divine Flame and Energy International Limited is an ISO-certified Nigerian oil & gas servicing company specializing in wellhead & Xmas tree equipment, choke valves, wellhead control panels, and preservation services.");
  const contactEmail = getText("company.contactEmail", "info@dfande.com");
  const hqAddress = getText("company.headquartersAddress", "Plot 12 Commercial Block, Victoria Island, Lagos, Nigeria");
  const facilityAddress = getText("company.facilityAddress", "Plot 45 Trans-Amadi Industrial Layout, Port Harcourt, Rivers State, Nigeria");
  const contactPhones = getList("company.contactPhones");
  
  const certItems = getJson<CertItem[]>("certifications.items", [
    { code: "ISO 9001:2015", label: "Quality Management" },
    { code: "ISO 14001:2015", label: "Environmental Management" },
    { code: "ISO 45001:2018", label: "Occupational Health & Safety" },
  ]);

  return (
    <footer className="bg-void text-white border-t border-void-line">
      <Container className="grid gap-10 py-16 md:grid-cols-4">
        {/* COL 1: LOGO & ABOUT */}
        <div>
          <div className="inline-block rounded-md bg-white px-3 py-2 shadow-sm">
            <Logo height={32} />
          </div>
          <p className="mt-4 max-w-[32ch] text-xs text-void-soft leading-relaxed">{aboutText}</p>
          <div className="mt-4 flex items-center gap-2 text-xs font-mono text-gold-dark">
            <ShieldCheck size={14} />
            <span>NCDMB Category 1 Accredited</span>
          </div>
        </div>

        {/* COL 2: CORE SERVICES */}
        <div>
          <h4 className="eyebrow mb-4 text-gold tracking-widest text-xs uppercase font-mono">Core Services</h4>
          <ul className="space-y-2 text-xs text-void-soft">
            {(services ?? []).slice(0, 8).map((s) => (
              <li key={s.slug}>
                <a href={`/services/${s.slug}`} className="hover:text-gold transition-colors">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* COL 3: QUICK LINKS & NAVIGATION */}
        <div>
          <h4 className="eyebrow mb-4 text-gold tracking-widest text-xs uppercase font-mono">Quick Links</h4>
          <ul className="space-y-2 text-xs text-void-soft">
            <li><a href="/about" className="hover:text-gold transition-colors">Company Overview</a></li>
            <li><a href="/about#milestones" className="hover:text-gold transition-colors">Key Milestones &amp; NCEC</a></li>
            <li><a href="/products" className="hover:text-gold transition-colors">Products Catalog</a></li>
            <li><a href="/projects" className="hover:text-gold transition-colors">Client Field Track Record</a></li>
            <li><a href="/certifications" className="hover:text-gold transition-colors">ISO Certifications &amp; Policies</a></li>
            <li><a href="/faq" className="hover:text-gold transition-colors">FAQs &amp; Technical Inquiries</a></li>
            <li><a href="/careers" className="hover:text-gold transition-colors">Careers &amp; Openings</a></li>
            <li><a href="/contact" className="hover:text-gold transition-colors">Contact Engineering Desk</a></li>
          </ul>
        </div>

        {/* COL 4: CONTACT & FACILITIES */}
        <div>
          <h4 className="eyebrow mb-4 text-gold tracking-widest text-xs uppercase font-mono">Operations &amp; Contacts</h4>
          <div className="space-y-3 text-xs text-void-soft">
            <p className="flex items-start gap-2">
              <Mail size={13} className="text-gold-dark flex-none mt-0.5" />
              <a href={`mailto:${contactEmail}`} className="hover:text-gold transition-colors">{contactEmail}</a>
            </p>
            {contactPhones.length > 0 && (
              <p className="flex items-start gap-2">
                <Phone size={13} className="text-gold-dark flex-none mt-0.5" />
                <span>{contactPhones.join(" · ")}</span>
              </p>
            )}
            <p className="flex items-start gap-2">
              <MapPin size={13} className="text-gold-dark flex-none mt-0.5" />
              <span><strong>HQ:</strong> {hqAddress}</span>
            </p>
            <p className="flex items-start gap-2">
              <MapPin size={13} className="text-gold-dark flex-none mt-0.5" />
              <span><strong>Facility:</strong> {facilityAddress}</span>
            </p>
          </div>

          <div className="mt-5 border-t border-void-line/60 pt-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-steel mb-1.5">Management Systems:</div>
            <div className="flex flex-wrap gap-1.5">
              {certItems.map((c) => (
                <span key={c.code} className="rounded bg-void-line px-2 py-0.5 text-[10px] font-mono text-void-soft">
                  {c.code}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Container>

      {/* COPYRIGHT BOTTOM BAR */}
      <div className="border-t border-void-line py-5">
        <Container className="flex flex-col gap-2 text-xs text-void-soft md:flex-row md:items-center md:justify-between">
          <span>
            © {year} {legalName}. All rights reserved.
          </span>
          <div className="flex gap-5">
            <a href="/certifications#hse-policy" className="hover:text-gold">
              HSE Policy
            </a>
            <a href="/certifications#quality-policy" className="hover:text-gold">
              Quality Policy
            </a>
            <a href="/faq" className="hover:text-gold">
              FAQs
            </a>
            <a href="/contact" className="hover:text-gold">
              Contact
            </a>
          </div>
        </Container>
      </div>
    </footer>
  );
}
